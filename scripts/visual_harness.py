"""
Visual review harness for brochure-derived evidence assets.

This harness is intentionally layered:
1. Asset audit: inspect generated evidence images before they ever reach the page.
2. Browser capture: open the real page, force lazy images to load, and capture
   page/section/card screenshots that can be reviewed or diffed.

It exists because full-page screenshots alone are too coarse to catch subtle
crop failures, edge clipping, or inconsistent document framing.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Iterable

import numpy as np
from PIL import Image, ImageDraw, ImageOps
from playwright.sync_api import Browser, Page, sync_playwright

PROJECT_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT_DIR = PROJECT_ROOT / ".artifacts" / "visual-harness"
CERT_ASSET_DIR = PROJECT_ROOT / "public/images/certs/evidence"


@dataclass
class AssetAuditResult:
    name: str
    width: int
    height: int
    bbox_left: int
    bbox_top: int
    bbox_right: int
    bbox_bottom: int
    fill_ratio: float
    issues: list[str]


@dataclass
class BrowserScenario:
    name: str
    path: str
    viewport_width: int
    viewport_height: int
    section_testid: str
    card_prefix: str
    expected_cards: int


BROWSER_SCENARIOS = [
    BrowserScenario(
        name="certifications-zh-desktop",
        path="/zh/certifications",
        viewport_width=1600,
        viewport_height=2200,
        section_testid="cert-evidence-grid",
        card_prefix="cert-card-figure-",
        expected_cards=8,
    ),
    BrowserScenario(
        name="about-zh-desktop",
        path="/zh/about",
        viewport_width=1600,
        viewport_height=2200,
        section_testid="about-evidence-grid",
        card_prefix="about-evidence-figure-",
        expected_cards=6,
    ),
    BrowserScenario(
        name="certifications-zh-mobile",
        path="/zh/certifications",
        viewport_width=390,
        viewport_height=844,
        section_testid="cert-evidence-grid",
        card_prefix="cert-card-figure-",
        expected_cards=8,
    ),
    BrowserScenario(
        name="about-zh-mobile",
        path="/zh/about",
        viewport_width=390,
        viewport_height=844,
        section_testid="about-evidence-grid",
        card_prefix="about-evidence-figure-",
        expected_cards=6,
    ),
]


def sample_background(image: np.ndarray) -> np.ndarray:
    corners = np.array(
        [
            image[0, 0],
            image[0, -1],
            image[-1, 0],
            image[-1, -1],
        ],
        dtype=np.int16,
    )
    return np.median(corners, axis=0)


def detect_content_bbox(image: np.ndarray, threshold: int = 12) -> tuple[int, int, int, int]:
    background = sample_background(image)
    distance = np.abs(image.astype(np.int16) - background).sum(axis=2)
    mask = distance > threshold
    coordinates = np.argwhere(mask)
    if len(coordinates) == 0:
        return (0, 0, image.shape[1], image.shape[0])
    y0, x0 = coordinates.min(axis=0)
    y1, x1 = coordinates.max(axis=0) + 1
    return (int(x0), int(y0), int(x1), int(y1))


def audit_image(path: Path) -> AssetAuditResult:
    image = np.array(Image.open(path).convert("RGB"))
    width = image.shape[1]
    height = image.shape[0]
    x0, y0, x1, y1 = detect_content_bbox(image)
    bbox_width = x1 - x0
    bbox_height = y1 - y0
    fill_ratio = (bbox_width * bbox_height) / float(width * height)

    margins = {
        "left": x0,
        "top": y0,
        "right": width - x1,
        "bottom": height - y1,
    }
    issues: list[str] = []
    if min(margins.values()) < 24:
        issues.append(f"content too close to edge: {margins}")
    if fill_ratio < 0.45:
        issues.append(f"content too small in frame: fill_ratio={fill_ratio:.3f}")
    if fill_ratio > 0.92:
        issues.append(f"content too large in frame: fill_ratio={fill_ratio:.3f}")

    return AssetAuditResult(
        name=path.name,
        width=width,
        height=height,
        bbox_left=x0,
        bbox_top=y0,
        bbox_right=x1,
        bbox_bottom=y1,
        fill_ratio=round(fill_ratio, 4),
        issues=issues,
    )


def make_contact_sheet(asset_dir: Path, output_path: Path, audit_results: dict[str, AssetAuditResult]) -> None:
    assets = sorted(asset_dir.glob("*.jpg"))
    thumbs: list[Image.Image] = []
    for path in assets:
        image = Image.open(path).convert("RGB")
        thumb = ImageOps.contain(image, (420, 420), method=Image.Resampling.LANCZOS)
        canvas = Image.new("RGB", (460, 540), "#eef3f8")
        canvas.paste(thumb, ((460 - thumb.width) // 2, 20))

        result = audit_results[path.name]
        draw = ImageDraw.Draw(canvas)
        draw.text((20, 465), path.name, fill="#0f172a")
        draw.text((20, 490), f"{result.width}x{result.height} fill={result.fill_ratio:.3f}", fill="#475569")
        if result.issues:
            draw.text((20, 515), "ISSUE: " + "; ".join(result.issues[:1]), fill="#b91c1c")
        else:
            draw.text((20, 515), "OK", fill="#166534")
        thumbs.append(canvas)

    columns = 2
    rows = (len(thumbs) + columns - 1) // columns
    sheet = Image.new("RGB", (columns * 460, rows * 540), "#e2e8f0")
    for index, thumb in enumerate(thumbs):
        sheet.paste(thumb, ((index % columns) * 460, (index // columns) * 540))
    output_path.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(output_path, quality=90)


def run_asset_audit(output_dir: Path) -> list[str]:
    issues: list[str] = []
    results: dict[str, AssetAuditResult] = {}
    for path in sorted(CERT_ASSET_DIR.glob("*.jpg")):
        result = audit_image(path)
        results[path.name] = result
        for issue in result.issues:
            issues.append(f"{path.name}: {issue}")

    output_dir.mkdir(parents=True, exist_ok=True)
    make_contact_sheet(CERT_ASSET_DIR, output_dir / "cert-assets-contact-sheet.jpg", results)
    report_path = output_dir / "asset-audit.json"
    report_path.write_text(
        json.dumps([asdict(results[name]) for name in sorted(results)], ensure_ascii=False, indent=2)
    )
    return issues


def wait_for_visual_readiness(page: Page) -> None:
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(1000)
    total_height = page.evaluate("() => document.documentElement.scrollHeight")
    step = max(320, int(page.viewport_size["height"] * 0.8))
    current = 0
    while current < total_height:
        page.evaluate("(scrollY) => window.scrollTo({ top: scrollY, behavior: 'instant' })", current)
        page.wait_for_timeout(250)
        current += step
    page.evaluate("() => window.scrollTo({ top: 0, behavior: 'instant' })")
    page.wait_for_timeout(800)
    page.wait_for_function(
        "() => Array.from(document.images).every((img) => img.complete && img.naturalWidth > 0)",
        timeout=10000,
    )


def scenario_output_dir(root: Path, scenario: BrowserScenario) -> Path:
    path = root / scenario.name
    path.mkdir(parents=True, exist_ok=True)
    return path


def capture_browser_scenario(browser: Browser, base_url: str, scenario: BrowserScenario, output_dir: Path) -> list[str]:
    issues: list[str] = []
    page = browser.new_page(viewport={"width": scenario.viewport_width, "height": scenario.viewport_height})
    url = f"{base_url.rstrip('/')}{scenario.path}"
    page.goto(url, wait_until="domcontentloaded")
    wait_for_visual_readiness(page)

    scenario_dir = scenario_output_dir(output_dir, scenario)
    page.screenshot(path=str(scenario_dir / "page.png"), full_page=True)

    section = page.get_by_test_id(scenario.section_testid)
    section.screenshot(path=str(scenario_dir / "section.png"))

    cards = page.locator(f"[data-testid^='{scenario.card_prefix}']")
    card_count = cards.count()
    if card_count != scenario.expected_cards:
        issues.append(
            f"{scenario.name}: expected {scenario.expected_cards} card figures, found {card_count}"
        )

    card_reports = []
    for index in range(card_count):
        card = cards.nth(index)
        testid = card.get_attribute("data-testid") or f"card-{index + 1}"
        image_path = scenario_dir / f"{testid}.png"
        card.screenshot(path=str(image_path))
        card_reports.append({"name": testid, "issues": []})

    dom_report = page.evaluate(
        """
        (prefix) => Array.from(document.querySelectorAll(`[data-testid^="${prefix}"] img, [data-testid^="${prefix}"]`))
          .map((node) => {
            const rect = node.getBoundingClientRect();
            return {
              tag: node.tagName,
              complete: node.complete ?? true,
              naturalWidth: node.naturalWidth ?? null,
              naturalHeight: node.naturalHeight ?? null,
              width: rect.width,
              height: rect.height,
            };
          })
        """,
        scenario.card_prefix,
    )
    (scenario_dir / "browser-report.json").write_text(
        json.dumps({"dom": dom_report, "cards": card_reports}, ensure_ascii=False, indent=2)
    )

    page.close()
    return issues


def run_browser_harness(base_url: str, output_dir: Path) -> list[str]:
    output_dir.mkdir(parents=True, exist_ok=True)
    issues: list[str] = []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        try:
            for scenario in BROWSER_SCENARIOS:
                issues.extend(capture_browser_scenario(browser, base_url, scenario, output_dir))
        finally:
            browser.close()
    return issues


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run visual review harness for Yinglit evidence pages.")
    parser.add_argument(
        "--mode",
        choices=["assets", "browser", "all"],
        default="all",
        help="Which stage to run.",
    )
    parser.add_argument(
        "--base-url",
        default=os.environ.get("BASE_URL", "http://127.0.0.1:3100"),
        help="Base URL for browser capture mode.",
    )
    parser.add_argument(
        "--output-dir",
        default=str(DEFAULT_OUTPUT_DIR),
        help="Directory to write screenshots and reports.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    output_dir = Path(args.output_dir)
    issues: list[str] = []

    if args.mode in {"assets", "all"}:
        issues.extend(run_asset_audit(output_dir / "assets"))
    if args.mode in {"browser", "all"}:
        issues.extend(run_browser_harness(args.base_url, output_dir / "browser"))

    if issues:
        print("Visual harness found issues:")
        for issue in issues:
            print(f"  - {issue}")
        return 1

    print(f"Visual harness passed. Artifacts written to {output_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
