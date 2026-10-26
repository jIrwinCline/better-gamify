import { cp, mkdir, rm, readFile, writeFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { packageSkills } from './package-skills.mjs';

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
await packageSkills(path.join(root, 'skills'), path.join(dist, 'downloads'));
await writeFile(path.join(dist, ".nojekyll"), "");
const config = JSON.parse(
  await readFile(path.join(root, "site/project.json"), "utf8"),
);
async function htmlPages(directory, prefix = '') {
  const pages = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) pages.push(...await htmlPages(path.join(directory, entry.name), relative));
    else if (entry.name.endsWith('.html')) pages.push(relative);
  }
  return pages.sort();
}
const pages = await htmlPages(path.join(root, 'site'));
for (const page of pages) {
  const file = path.join(dist, page);
  const html = await readFile(file, "utf8");
  await writeFile(
    file,
    html.replaceAll("https://example.invalid/better-gamify/", config.siteUrl),
  );
}
await writeFile(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(page => `<url><loc>${config.siteUrl}${page.replace(/index\.html$/, '')}</loc></url>`).join('')}</urlset>\n`,
);
await writeFile(
  path.join(dist, "robots.txt"),
  `User-agent: *\nAllow: /\nSitemap: ${config.siteUrl}sitemap.xml\n`,
);
console.log("Built the static gallery in dist/.");
