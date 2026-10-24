import { cp, mkdir, rm, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const dist = path.join(root, "dist");
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
for (const [source, destination] of [
  ["site", ""],
  ["components", "components"],
  ["skills", "skills"],
]) {
  await cp(path.join(root, source), path.join(dist, destination), {
    recursive: true,
  });
}
await cp(path.join(root, "LICENSE"), path.join(dist, "LICENSE.txt"));
await writeFile(path.join(dist, ".nojekyll"), "");
const config = JSON.parse(
  await readFile(path.join(root, "site/project.json"), "utf8"),
);
for (const page of ["index.html", "patterns/action-credits/index.html"]) {
  const file = path.join(dist, page);
  const html = await readFile(file, "utf8");
  await writeFile(
    file,
    html.replaceAll("https://example.invalid/better-gamify/", config.siteUrl),
  );
}
await writeFile(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${config.siteUrl}</loc></url><url><loc>${config.siteUrl}patterns/action-credits/</loc></url></urlset>\n`,
);
await writeFile(
  path.join(dist, "robots.txt"),
  `User-agent: *\nAllow: /\nSitemap: ${config.siteUrl}sitemap.xml\n`,
);
console.log("Built the static gallery in dist/.");
