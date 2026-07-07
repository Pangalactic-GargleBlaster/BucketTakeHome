import type { IncidentReport } from "../../../types";
import { SeverityLevel } from "../../../types";

const SEVERITY_RGB: Record<SeverityLevel, string> = {
  [SeverityLevel.LOW]: "0, 128, 0",
  [SeverityLevel.MEDIUM]: "0, 0, 255",
  [SeverityLevel.HIGH]: "255, 255, 0",
  [SeverityLevel.CRITICAL]: "255, 0, 0",
};

const IMAGE_SIZE = 300;

const SUMMARY_FIELDS = [
  "part_name",
  "defect_type",
  "severity",
  "confidence",
  "status",
  "station",
  "created_at",
] as const satisfies ReadonlyArray<keyof IncidentReport>;

function formatFieldName(name: string): string {
  return name.replace(/_/g, " ");
}

function formatFieldValue(
  field: (typeof SUMMARY_FIELDS)[number],
  report: IncidentReport,
): string {
  if (field === "created_at") {
    return new Date(report.created_at).toLocaleString();
  }
  return String(report[field]);
}

export function IncidentReportSummaryCard({ ...report }: IncidentReport) {
  const rgb = SEVERITY_RGB[report.severity];
  const backgroundColor = `rgba(${rgb}, ${report.confidence})`;

  return (
    <div
      style={{
        backgroundColor,
        display: "flex",
        flexDirection: "column",
        width: IMAGE_SIZE,
        margin: 10,
      }}
    >
      <div
        style={{
          width: IMAGE_SIZE,
          height: IMAGE_SIZE,
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <img
          src={report.image_url}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <div>
        {SUMMARY_FIELDS.map((field) => (
          <div
            key={field}
            style={{ border: "1px solid black", padding: "4px 8px" }}
          >
            <strong>{formatFieldName(field)}</strong>:{" "}
            {formatFieldValue(field, report)}
          </div>
        ))}
      </div>
    </div>
  );
}
