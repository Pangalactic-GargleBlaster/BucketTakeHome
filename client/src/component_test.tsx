import { createRoot } from "react-dom/client";
import type { ComponentType } from "react";
import type { IncidentReport } from "../../types";
import { IncidentReportSummaryCard } from "./components/IncidentReportSummaryCard";

const COMPONENTS: Record<string, ComponentType<IncidentReport>> = {
  IncidentReportSummaryCard,
};

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

async function main() {
  const params = new URLSearchParams(window.location.search);
  const componentName = params.get("component");

  if (!componentName) {
    renderMessage("Missing ?component= parameter");
    return;
  }

  const Component = COMPONENTS[componentName];
  if (!Component) {
    renderMessage(`Unknown component: ${componentName}`);
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

  const report = { ...reports[0], ...overrides };
  const root = document.getElementById("root");
  if (!root) return;

  createRoot(root).render(<Component {...report} />);
}

main();
