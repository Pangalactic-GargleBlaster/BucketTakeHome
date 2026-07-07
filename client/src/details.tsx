import { createRoot } from "react-dom/client";
import { fetchDefectReport } from "./api";
import { DefectReportDetails } from "./components/DefectReportDetails";

async function bootstrap() {
  const rootEl = document.getElementById("root");
  if (!rootEl) return;

  const reportId = new URLSearchParams(window.location.search).get("report_id");
  if (!reportId) {
    createRoot(rootEl).render(<p>Missing report_id parameter</p>);
    return;
  }

  try {
    const report = await fetchDefectReport(reportId);
    createRoot(rootEl).render(<DefectReportDetails {...report} />);
  } catch {
    createRoot(rootEl).render(<p>Failed to load defect report</p>);
  }
}

bootstrap();
