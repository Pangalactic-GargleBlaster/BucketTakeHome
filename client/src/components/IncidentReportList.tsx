import type { IncidentReport } from "../../../types";
import { IncidentReportSummaryCard } from "./IncidentReportSummaryCard";

export function IncidentReportList({
  reports,
}: {
  reports: IncidentReport[];
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {reports.map((report) => (
        <IncidentReportSummaryCard key={report.report_id} {...report} />
      ))}
    </div>
  );
}
