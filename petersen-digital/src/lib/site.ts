import fs from "fs";
import path from "path";
import type { SiteConfig } from "./types";

const SITE_CONFIG_PATH = path.join(process.cwd(), "content", "site.json");

export function getSiteConfig(): SiteConfig {
  const raw = fs.readFileSync(SITE_CONFIG_PATH, "utf8");
  return JSON.parse(raw) as SiteConfig;
}
