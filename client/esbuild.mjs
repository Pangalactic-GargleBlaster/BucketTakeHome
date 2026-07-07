import * as esbuild from "esbuild";
import { copyFileSync, cpSync, mkdirSync } from "node:fs";

const watch = process.argv.includes("--watch");

function copyAssets() {
  mkdirSync("dist", { recursive: true });
  copyFileSync("index.html", "dist/index.html");
  copyFileSync("details.html", "dist/details.html");
  copyFileSync("component_test.html", "dist/component_test.html");
  cpSync("images", "dist/images", { recursive: true });
}

const common = {
  bundle: true,
  loader: { ".tsx": "tsx" },
  sourcemap: watch,
};

const entries = [
  { in: "src/main.tsx", out: "dist/bundle.js" },
  { in: "src/details.tsx", out: "dist/details.js" },
  { in: "src/component_test.tsx", out: "dist/component_test.js" },
];

copyAssets();

if (watch) {
  const contexts = await Promise.all(
    entries.map((entry) =>
      esbuild.context({ ...common, entryPoints: [entry.in], outfile: entry.out }),
    ),
  );
  await Promise.all(contexts.map((ctx) => ctx.watch()));
} else {
  await Promise.all(
    entries.map((entry) =>
      esbuild.build({ ...common, entryPoints: [entry.in], outfile: entry.out }),
    ),
  );
}
