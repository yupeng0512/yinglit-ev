import productsData from "@/data/products.json";
import categoriesData from "@/data/categories.json";
import settingsData from "@/data/settings.json";
import type { DataProvider, Product, Category, SiteSettings } from "../types";

const provider: DataProvider = {
  async getProducts(options) {
    let products = productsData as unknown as Product[];
    if (options?.category) {
      products = products.filter((p) => p.category === options.category);
    }
    if (options?.status) {
      products = products.filter((p) => p.status === options.status);
    } else {
      products = products.filter((p) => p.status === "active");
    }
    if (options?.limit) {
      products = products.slice(0, options.limit);
    }
    return products;
  },

  async getProductBySlug(slug) {
    return (
      (productsData as unknown as Product[]).find((p) => p.slug === slug) ||
      null
    );
  },

  async getCategories() {
    const categories = categoriesData as unknown as Category[];
    const products = productsData as unknown as Product[];
    return categories
      .map((cat) => ({
        ...cat,
        productCount: products.filter(
          (p) => p.category === cat.slug && p.status === "active"
        ).length,
      }))
      .sort((a, b) => a.order - b.order);
  },

  async getSiteSettings() {
    return settingsData as unknown as SiteSettings;
  },
};

export default provider;
