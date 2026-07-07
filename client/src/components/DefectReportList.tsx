import type { DefectReport } from "../../../types";
import { DefectReportSummaryCard } from "./DefectReportSummaryCard";

export function DefectReportList({
  reports,
}: {
  reports: DefectReport[];
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {reports.map((report) => (
        <DefectReportSummaryCard key={report.report_id} {...report} />
      ))}
    </div>
  );
}
