import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { get_defect_report } from "./get_defect_report.js";
import { get_defect_reports } from "./get_defect_reports.js";
import { record_review } from "./record_review.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDir = path.resolve(__dirname, "../../client/dist");

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

app.get("/defect_reports", (_req, res) => {
  res.json(get_defect_reports());
});

app.get("/defect_report", (req, res) => {
  const report_id = req.query.report_id;
  if (typeof report_id !== "string" || report_id.length === 0) {
    res.status(400).json({ error: "report_id query parameter is required" });
    return;
  }
  const report = get_defect_report(report_id);
  if (!report) {
    res.status(404).json({ error: "defect report not found" });
    return;
  }
  res.json(report);
});

app.post("/review", (req, res) => {
  const report = req.body;
  if (
    !report ||
    typeof report !== "object" ||
    typeof report.report_id !== "string" ||
    report.report_id.length === 0
  ) {
    res.status(400).json({ error: "valid DefectReport body with report_id is required" });
    return;
  }

  try {
    res.json(record_review(report));
  } catch {
    res.status(400).json({ error: "invalid DefectReport body" });
  }
});

app.get("/details", (_req, res) => {
  res.sendFile(path.join(clientDir, "details.html"));
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
