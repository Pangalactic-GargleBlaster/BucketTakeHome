import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { get_defect_reports } from "./get_defect_reports.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDir = path.resolve(__dirname, "../../client/dist");

const app = express();
const port = Number(process.env.PORT) || 3000;

app.get("/defect_reports", (_req, res) => {
  res.json(get_defect_reports());
});

app.get("/component_test", (_req, res) => {
  res.sendFile(path.join(clientDir, "component_test.html"));
});

app.use(express.static(clientDir));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}).on("error", (err: NodeJS.ErrnoException) => {
  console.error(err);
  process.exit(1);
});
