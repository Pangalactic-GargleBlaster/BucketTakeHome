import { createRoot } from "react-dom/client";
import type { DefectReport } from "../../types";
import { DefectReportHome } from "./components/DefectReportHome";

async function bootstrap() {
  const rootEl = document.getElementById("root");
  if (!rootEl) return;

  try {
    const response = await fetch("/defect_reports");
    if (!response.ok) {
      createRoot(rootEl).render(
        <p>Failed to load defect reports ({response.status})</p>,
      );
      return;
    }
    const reports: DefectReport[] = await response.json();
    createRoot(rootEl).render(<DefectReportHome reports={reports} />);
  } catch {
    createRoot(rootEl).render(<p>Failed to load defect reports</p>);
  }
}

bootstrap();
