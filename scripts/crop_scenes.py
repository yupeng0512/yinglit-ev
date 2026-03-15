"""
Crop brochure scenes into website-ready assets.

The scene crops serve two different needs:
- broad visual crops for hero/about/solutions sections
- document evidence crops for certifications

Certification evidence is handled differently on purpose. Instead of
cropping a broad brochure region and hoping post-processing will isolate
the right page, we detect certificate frames on the source PDF page and
build presentation-ready assets with consistent breathing room.
"""

from __future__ import annotations

from pathlib import Path
from typing import Sequence

import cv2
import fitz
import numpy as np
from PIL import Image

PDF_PATH = "/data/workspace/Yinglit EV Charger 2026.pdf"
DPI = 300
PROJECT_ROOT = Path("/data/workspace/yinglit-ev")
CERT_CARD_BACKGROUND = (245, 248, 252)
CERT_CARD_PADDING = 40

SCENE_CROPS = [
    # --- Hero ---
    {
        "page": 1,
        "area": (0.62, 0.24, 0.99, 0.81),
        "output": "public/images/hero-home.jpg",
        "desc": "Home charging scene (clean crop without brochure logo)",
    },
    {
        "page": 1,
        "area": (0.0, 0.05, 0.52, 0.78),
        "output": "public/images/hero-products.jpg",
        "desc": "Full product lineup",
    },
    # --- Solutions ---
    {
        "page": 8,
        "area": (0.0, 0.0, 0.50, 0.55),
        "output": "public/images/solutions/home.jpg",
        "desc": "Home charging solution diagram",
    },
    {
        "page": 9,
        "area": (0.0, 0.0, 0.50, 0.55),
        "output": "public/images/solutions/public.jpg",
        "desc": "Public charging solution architecture",
    },
    {
        "page": 9,
        "area": (0.50, 0.0, 1.0, 0.55),
        "output": "public/images/solutions/commercial.jpg",
        "desc": "Cloud platform + APP (commercial)",
    },
    # --- About / Factory ---
    {
        "page": 3,
        "area": (0.08, 0.58, 0.47, 0.88),
        "output": "public/images/about/factory.jpg",
        "desc": "Company building exterior (clean crop)",
    },
    {
        "page": 3,
        "area": (0.54, 0.12, 0.95, 0.90),
        "output": "public/images/about/production.jpg",
        "desc": "Production line photo grid (reference only)",
    },
    {
        "page": 3,
        "area": (0.53, 0.55, 0.95, 0.92),
        "output": "public/images/about/warehouse.jpg",
        "desc": "Warehouse + testing equipment (reference only)",
    },
    {
        "page": 3,
        "area": (0.525, 0.115, 0.68, 0.335),
        "output": "public/images/about/evidence/assembly-line.jpg",
        "desc": "Automated assembly line",
        "postprocess": "main_component",
    },
    {
        "page": 3,
        "area": (0.815, 0.115, 0.955, 0.335),
        "output": "public/images/about/evidence/electronics-assembly.jpg",
        "desc": "Electronics assembly station",
        "postprocess": "main_component",
    },
    {
        "page": 3,
        "area": (0.525, 0.335, 0.68, 0.56),
        "output": "public/images/about/evidence/testing-workstation.jpg",
        "desc": "Testing workstation",
        "postprocess": "main_component",
    },
    {
        "page": 3,
        "area": (0.68, 0.335, 0.82, 0.56),
        "output": "public/images/about/evidence/production-floor.jpg",
        "desc": "Production floor inspection",
        "postprocess": "main_component",
    },
    {
        "page": 3,
        "area": (0.525, 0.555, 0.68, 0.78),
        "output": "public/images/about/evidence/high-power-cabinets.jpg",
        "desc": "High-power cabinet testing area",
        "postprocess": "main_component",
    },
    {
        "page": 3,
        "area": (0.68, 0.775, 0.82, 0.97),
        "output": "public/images/about/evidence/charger-line.jpg",
        "desc": "Charger line output",
        "postprocess": "main_component",
    },
    # --- Certifications reference wall ---
    {
        "page": 4,
        "area": (0.15, 0.14, 0.95, 0.89),
        "output": "public/images/certs/certificates.jpg",
        "desc": "Enterprise qualification certificates grid (reference only)",
    },
    # --- Project Cases ---
    {
        "page": 30,
        "area": (0.0, 0.07, 0.50, 0.98),
        "output": "public/images/cases/cases-left.jpg",
        "desc": "Project cases - left column",
    },
    {
        "page": 30,
        "area": (0.50, 0.0, 1.0, 0.75),
        "output": "public/images/cases/cases-right.jpg",
        "desc": "Project cases - right column",
    },
    # --- Government subsidy (KfW) ---
    {
        "page": 7,
        "area": (0.50, 0.05, 1.0, 0.45),
        "output": "public/images/solutions/home-install.jpg",
        "desc": "Home charging installation illustration",
    },
]

CERTIFICATE_EVIDENCE = [
    {
        "id": "eu-type-examination",
        "box_index": 1,
        "output": "public/images/certs/evidence/eu-type-examination.jpg",
        "desc": "EU type examination certificate",
    },
    {
        "id": "eu-type-matrix",
        "box_index": 2,
        "output": "public/images/certs/evidence/eu-type-matrix.jpg",
        "desc": "EU type examination model matrix",
    },
    {
        "id": "low-voltage-certificate",
        "box_index": 4,
        "output": "public/images/certs/evidence/low-voltage-certificate.jpg",
        "desc": "Low-voltage compliance certificate",
    },
    {
        "id": "high-tech-enterprise",
        "box_index": 6,
        "output": "public/images/certs/evidence/high-tech-enterprise.jpg",
        "desc": "National high-tech enterprise certificate",
    },
    {
        "id": "ce-attestation-a",
        "box_index": 7,
        "output": "public/images/certs/evidence/ce-attestation-a.jpg",
        "desc": "CE attestation of conformity",
    },
    {
        "id": "ce-attestation-b",
        "box_index": 8,
        "output": "public/images/certs/evidence/ce-attestation-b.jpg",
        "desc": "CE conformity declaration",
    },
    {
        "id": "low-voltage-certificate-b",
        "box_index": 10,
        "output": "public/images/certs/evidence/low-voltage-certificate-b.jpg",
        "desc": "Secondary low-voltage certificate",
    },
    {
        "id": "utility-patent",
        "box_index": 14,
        "output": "public/images/certs/evidence/utility-patent.jpg",
        "desc": "Utility model patent certificate",
    },
]


def pix_to_rgb(pix: fitz.Pixmap) -> np.ndarray:
    image = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width, pix.n)
    if pix.alpha:
        image = image[:, :, :3]
    return image.copy()


def render_page_rgb(page: fitz.Page, dpi: int = DPI) -> np.ndarray:
    return pix_to_rgb(page.get_pixmap(dpi=dpi))


def trim_to_main_component(image: np.ndarray, padding: int = 12) -> np.ndarray:
    mean = image.mean(axis=2)
    variation = image.max(axis=2) - image.min(axis=2)
    foreground = (mean < 248) | (variation > 18)

    component_count, _, stats, _ = cv2.connectedComponentsWithStats(foreground.astype("uint8"), 8)
    if component_count <= 1:
        return image

    largest_label = 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])
    x = stats[largest_label, cv2.CC_STAT_LEFT]
    y = stats[largest_label, cv2.CC_STAT_TOP]
    width = stats[largest_label, cv2.CC_STAT_WIDTH]
    height = stats[largest_label, cv2.CC_STAT_HEIGHT]

    x0 = max(0, x - padding)
    y0 = max(0, y - padding)
    x1 = min(image.shape[1], x + width + padding)
    y1 = min(image.shape[0], y + height + padding)
    return image[y0:y1, x0:x1]


def postprocess_crop(image: np.ndarray, mode: str | None) -> np.ndarray:
    if mode == "main_component":
        return trim_to_main_component(image)
    return image


def save_image(image: np.ndarray | Image.Image, output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    if isinstance(image, np.ndarray):
        image = Image.fromarray(image)
    image.save(output_path, quality=90, optimize=True)


def crop_area(page: fitz.Page, area: Sequence[float]) -> np.ndarray:
    rect = page.rect
    x0, y0, x1, y1 = area
    clip = fitz.Rect(
        rect.x0 + rect.width * x0,
        rect.y0 + rect.height * y0,
        rect.x0 + rect.width * x1,
        rect.y0 + rect.height * y1,
    )
    return pix_to_rgb(page.get_pixmap(clip=clip, dpi=DPI))


def box_iou(box_a: tuple[int, int, int, int], box_b: tuple[int, int, int, int]) -> float:
    ax, ay, aw, ah = box_a
    bx, by, bw, bh = box_b
    ax1, ay1 = ax + aw, ay + ah
    bx1, by1 = bx + bw, by + bh
    ix = max(0, min(ax1, bx1) - max(ax, bx))
    iy = max(0, min(ay1, by1) - max(ay, by))
    intersection = ix * iy
    union = aw * ah + bw * bh - intersection
    return intersection / union if union else 0.0


def box_containment(box_a: tuple[int, int, int, int], box_b: tuple[int, int, int, int]) -> float:
    ax, ay, aw, ah = box_a
    bx, by, bw, bh = box_b
    ax1, ay1 = ax + aw, ay + ah
    bx1, by1 = bx + bw, by + bh
    ix = max(0, min(ax1, bx1) - max(ax, bx))
    iy = max(0, min(ay1, by1) - max(ay, by))
    intersection = ix * iy
    return intersection / min(aw * ah, bw * bh)


def detect_document_boxes(page_image: np.ndarray) -> list[tuple[int, int, int, int]]:
    gray = cv2.cvtColor(page_image, cv2.COLOR_RGB2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    edges = cv2.Canny(blurred, 50, 150)
    contours, _ = cv2.findContours(edges, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)

    candidates: list[tuple[int, int, int, int, int]] = []
    for contour in contours:
        perimeter = cv2.arcLength(contour, True)
        approx = cv2.approxPolyDP(contour, 0.02 * perimeter, True)
        if len(approx) != 4:
            continue
        x, y, width, height = cv2.boundingRect(approx)
        area = width * height
        ratio = width / height
        if 80000 < area < 1000000 and 0.55 < ratio < 1.8:
            candidates.append((x, y, width, height, area))

    deduped: list[tuple[int, int, int, int, int]] = []
    for candidate in sorted(candidates, key=lambda box: box[4], reverse=True):
        base_box = candidate[:4]
        if any(
            box_iou(base_box, kept[:4]) > 0.85 or box_containment(base_box, kept[:4]) > 0.92
            for kept in deduped
        ):
            continue
        deduped.append(candidate)

    return [box[:4] for box in sorted(deduped, key=lambda box: (box[1], box[0]))]


def crop_box(page_image: np.ndarray, box: tuple[int, int, int, int], padding: int = 24) -> np.ndarray:
    x, y, width, height = box
    x0 = max(0, x - padding)
    y0 = max(0, y - padding)
    x1 = min(page_image.shape[1], x + width + padding)
    y1 = min(page_image.shape[0], y + height + padding)
    return page_image[y0:y1, x0:x1]


def build_document_presentation(document_image: np.ndarray) -> Image.Image:
    document = Image.fromarray(document_image).convert("RGB")
    canvas = Image.new(
        "RGB",
        (document.width + CERT_CARD_PADDING * 2, document.height + CERT_CARD_PADDING * 2),
        CERT_CARD_BACKGROUND,
    )
    canvas.paste(document, (CERT_CARD_PADDING, CERT_CARD_PADDING))
    return canvas


def generate_certification_evidence(doc: fitz.Document) -> None:
    page = doc[3]
    page_image = render_page_rgb(page)
    boxes = detect_document_boxes(page_image)
    if len(boxes) < 18:
        raise RuntimeError(f"Expected at least 18 certificate boxes on page 4, found {len(boxes)}")

    print(f"Detected {len(boxes)} certificate/page boxes on page 4")
    for item in CERTIFICATE_EVIDENCE:
        box = boxes[item["box_index"] - 1]
        cropped = crop_box(page_image, box, padding=30)
        presentation = build_document_presentation(cropped)
        output_path = PROJECT_ROOT / item["output"]
        save_image(presentation, output_path)
        size_kb = output_path.stat().st_size / 1024
        print(
            f"  Cert {item['box_index']:2d} → {item['output']:45s} "
            f"({presentation.width}x{presentation.height}, {size_kb:.0f}KB)"
        )
        print(f"           {item['desc']}")


def main() -> None:
    doc = fitz.open(PDF_PATH)
    print(f"PDF: {PDF_PATH} ({len(doc)} pages)")
    print(f"Cropping {len(SCENE_CROPS)} scene images at {DPI} DPI\n")

    for crop in SCENE_CROPS:
        page = doc[crop["page"] - 1]
        image = postprocess_crop(crop_area(page, crop["area"]), crop.get("postprocess"))
        output_path = PROJECT_ROOT / crop["output"]
        save_image(image, output_path)

        size_kb = output_path.stat().st_size / 1024
        print(
            f"  Page {crop['page']:2d} → {crop['output']:45s} "
            f"({image.shape[1]}x{image.shape[0]}, {size_kb:.0f}KB)"
        )
        print(f"           {crop['desc']}")

    print()
    generate_certification_evidence(doc)

    doc.close()
    total_assets = len(SCENE_CROPS) + len(CERTIFICATE_EVIDENCE)
    print(f"\nOK: {total_assets} scene assets generated.")


if __name__ == "__main__":
    main()
