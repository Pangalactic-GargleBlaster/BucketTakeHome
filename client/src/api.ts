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

export async function fetchDefectReport(
  reportId: string,
): Promise<DefectReport> {
  const response = await fetch(
    `/defect_report?report_id=${encodeURIComponent(reportId)}`,
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch defect report (${response.status})`);
  }

  const data: DefectReport = await response.json();
  return {
    ...data,
    created_at: new Date(data.created_at),
  };
}

export async function submitReview(report: DefectReport): Promise<DefectReport> {
  const response = await fetch("/review", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...report,
      created_at: report.created_at.toISOString(),
    }),
  });
  if (!response.ok) {
    throw new Error(`Failed to save review (${response.status})`);
  }

  const data: DefectReport = await response.json();
  return {
    ...data,
    created_at: new Date(data.created_at),
  };
}
