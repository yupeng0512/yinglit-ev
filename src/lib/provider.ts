import type { DataProvider } from "./types";
import staticJsonProvider from "./providers/static-json";

let _provider: DataProvider | null = null;

export async function getProvider(): Promise<DataProvider> {
  if (!_provider) {
    _provider = staticJsonProvider;
  }
  return _provider;
}
