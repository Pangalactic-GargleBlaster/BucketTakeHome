import type { DefectReport } from "../../types";

export async function fetchDefectReports(): Promise<DefectReport[]> {
  const response = await fetch("/defect_reports");
  if (!response.ok) {
    throw new Error(`Failed to fetch defect reports (${response.status})`);
  }

  const data: DefectReport[] = await response.json();
  return data.map((report) => ({
    ...report,
    created_at: new Date(report.created_at),
  }));
}
