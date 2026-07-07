import type { IncidentReport } from "../../types";

export async function fetchIncidentReports(): Promise<IncidentReport[]> {
  const response = await fetch("/incident_reports");
  if (!response.ok) {
    throw new Error(`Failed to fetch incident reports (${response.status})`);
  }

  const data: IncidentReport[] = await response.json();
  return data.map((report) => ({
    ...report,
    created_at: new Date(report.created_at),
  }));
}
