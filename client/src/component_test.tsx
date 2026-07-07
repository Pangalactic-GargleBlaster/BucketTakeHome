import { createRoot } from "react-dom/client";
import { useState } from "react";
import type { ReactNode } from "react";
import type { DefectReport } from "../../types";
import { SeverityLevel } from "../../types";
import { DefectReportSummaryCard } from "./components/DefectReportSummaryCard";
import { DefectReportList } from "./components/DefectReportList";
import { DefectReportDetails } from "./components/DefectReportDetails";
import { DefectReportHome } from "./components/DefectReportHome";
import { StringFilterPicker } from "./components/StringFilterPicker";
import { DatetimeFilterPicker } from "./components/DatetimeFilterPicker";
import { ConfidenceFilterPicker } from "./components/ConfidenceFilterPicker";

function StringFilterPickerTest() {
  const [selectedValues, setSelectedValues] = useState(() => new Set<string>());

  return (
    <StringFilterPicker
      options={new Set(Object.values(SeverityLevel))}
      selectedValues={selectedValues}
      onSelectedValuesChange={setSelectedValues}
    />
  );
}

function DatetimeFilterPickerTest() {
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);

  return (
    <DatetimeFilterPicker
      start={start}
      end={end}
      onStartChange={setStart}
      onEndChange={setEnd}
    />
  );
}

function ConfidenceFilterPickerTest() {
  const [lower, setLower] = useState(0);
  const [upper, setUpper] = useState(1);

  return (
    <ConfidenceFilterPicker
      lower={lower}
      upper={upper}
      onLowerChange={setLower}
      onUpperChange={setUpper}
    />
  );
}

function renderMessage(message: string) {
  const root = document.getElementById("root");
  if (!root) return;
  createRoot(root).render(<p>{message}</p>);
}

function parseOverrides(overridesParam: string): Partial<DefectReport> | null {
  try {
    return JSON.parse(overridesParam) as Partial<DefectReport>;
  } catch {
    return null;
  }
}

function renderComponent(
  componentName: string,
  reports: DefectReport[],
  overrides: Partial<DefectReport>,
) {
  const root = document.getElementById("root");
  if (!root) return;

  let content: ReactNode;
  switch (componentName) {
    case "DefectReportSummaryCard":
      content = (
        <DefectReportSummaryCard {...{ ...reports[0], ...overrides }} />
      );
      break;
    case "DefectReportList":
      content = <DefectReportList reports={reports} />;
      break;
    case "DefectReportDetails":
      content = (
        <DefectReportDetails {...{ ...reports[0], ...overrides }} />
      );
      break;
    case "DefectReportHome":
      content = <DefectReportHome reports={reports} />;
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

  if (componentName === "StringFilterPicker") {
    const root = document.getElementById("root");
    if (!root) return;
    createRoot(root).render(<StringFilterPickerTest />);
    return;
  }

  if (componentName === "DatetimeFilterPicker") {
    const root = document.getElementById("root");
    if (!root) return;
    createRoot(root).render(<DatetimeFilterPickerTest />);
    return;
  }

  if (componentName === "ConfidenceFilterPicker") {
    const root = document.getElementById("root");
    if (!root) return;
    createRoot(root).render(<ConfidenceFilterPickerTest />);
    return;
  }

  let overrides: Partial<DefectReport> = {};
  const overridesParam = params.get("overrides");
  if (overridesParam) {
    const parsed = parseOverrides(overridesParam);
    if (!parsed) {
      renderMessage("Invalid overrides JSON");
      return;
    }
    overrides = parsed;
  }

  let reports: DefectReport[];
  try {
    const response = await fetch("/defect_reports");
    if (!response.ok) {
      renderMessage(`Failed to fetch defect reports (${response.status})`);
      return;
    }
    reports = await response.json();
  } catch {
    renderMessage("Failed to fetch defect reports");
    return;
  }

  if (reports.length === 0) {
    renderMessage("No defect reports available");
    return;
  }

  renderComponent(componentName, reports, overrides);
}

main();
