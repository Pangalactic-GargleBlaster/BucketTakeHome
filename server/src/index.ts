import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { get_incident_reports } from "./get_incident_reports.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDir = path.resolve(__dirname, "../../client/dist");

const app = express();
const port = Number(process.env.PORT) || 3000;

app.get("/incident_reports", (_req, res) => {
  res.json(get_incident_reports());
});

app.use(express.static(clientDir));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
