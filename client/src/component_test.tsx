import { createRoot } from "react-dom/client";
import type { ReactNode } from "react";
import type { IncidentReport } from "../../types";
import { IncidentReportSummaryCard } from "./components/IncidentReportSummaryCard";
import { IncidentReportList } from "./components/IncidentReportList";
import { IncidentReportDetails } from "./components/IncidentReportDetails";

function renderMessage(message: string) {
  const root = document.getElementById("root");
  if (!root) return;
  createRoot(root).render(<p>{message}</p>);
}

function parseOverrides(overridesParam: string): Partial<IncidentReport> | null {
  try {
    return JSON.parse(overridesParam) as Partial<IncidentReport>;
  } catch {
    return null;
  }
}

function renderComponent(
  componentName: string,
  reports: IncidentReport[],
  overrides: Partial<IncidentReport>,
) {
  const root = document.getElementById("root");
  if (!root) return;

  let content: ReactNode;
  switch (componentName) {
    case "IncidentReportSummaryCard":
      content = (
        <IncidentReportSummaryCard {...{ ...reports[0], ...overrides }} />
      );
      break;
    case "IncidentReportList":
      content = <IncidentReportList reports={reports} />;
      break;
    case "IncidentReportDetails":
      content = (
        <IncidentReportDetails {...{ ...reports[0], ...overrides }} />
      );
      break;
    default:
      renderMessage(`Unknown component: ${componentName}`);
      return;
  }

  createRoot(root).render(content);
}

async function main() {
  const params = new URLSearchParams(window.location.search);
  const componentName = params.get("component");

  if (!componentName) {
    renderMessage("Missing ?component= parameter");
    return;
  }

  let overrides: Partial<IncidentReport> = {};
  const overridesParam = params.get("overrides");
  if (overridesParam) {
    const parsed = parseOverrides(overridesParam);
    if (!parsed) {
      renderMessage("Invalid overrides JSON");
      return;
    }
    overrides = parsed;
  }

  let reports: IncidentReport[];
  try {
    const response = await fetch("/incident_reports");
    if (!response.ok) {
      renderMessage(`Failed to fetch incident reports (${response.status})`);
      return;
    }
    reports = await response.json();
  } catch {
    renderMessage("Failed to fetch incident reports");
    return;
  }

  if (reports.length === 0) {
    renderMessage("No incident reports available");
    return;
  }

  renderComponent(componentName, reports, overrides);
}

main();
