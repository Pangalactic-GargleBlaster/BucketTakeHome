import { createRoot } from "react-dom/client";
import type { IncidentReport } from "../../types";
import { IncidentReportHome } from "./components/IncidentReportHome";

async function bootstrap() {
  const rootEl = document.getElementById("root");
  if (!rootEl) return;

  try {
    const response = await fetch("/incident_reports");
    if (!response.ok) {
      createRoot(rootEl).render(
        <p>Failed to load incident reports ({response.status})</p>,
      );
      return;
    }
    const reports: IncidentReport[] = await response.json();
    createRoot(rootEl).render(<IncidentReportHome reports={reports} />);
  } catch {
    createRoot(rootEl).render(<p>Failed to load incident reports</p>);
  }
}

bootstrap();
