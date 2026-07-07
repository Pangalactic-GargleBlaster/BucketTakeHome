import { useState } from "react";
import type { IncidentReport } from "../../../types";
import { ReviewStatus } from "../../../types";

const IMAGE_SIZE = 500;

const DETAIL_FIELDS = [
  "part_name",
  "part_id",
  "defect_type",
  "severity",
  "confidence",
  "station",
  "created_at",
  "finding_summary",
] as const satisfies ReadonlyArray<keyof IncidentReport>;

function formatFieldName(name: string): string {
  return name.replace(/_/g, " ");
}

function formatFieldValue(
  field: (typeof DETAIL_FIELDS)[number],
  report: IncidentReport,
): string {
  if (field === "created_at") {
    return new Date(report.created_at).toLocaleString();
  }
  return String(report[field]);
}

function ImagePanel({
  label,
  url,
  labelAlign = "left",
}: {
  label: string;
  url: string;
  labelAlign?: "left" | "right";
}) {
  return (
    <div style={{ margin: 10 }}>
      <div
        style={{
          marginBottom: 8,
          fontWeight: "bold",
          textAlign: labelAlign,
        }}
      >
        {label}
      </div>
      <div
        style={{
          width: IMAGE_SIZE,
          height: IMAGE_SIZE,
          overflow: "hidden",
        }}
      >
        <img
          src={url}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </div>
  );
}

export function IncidentReportDetails({ ...report }: IncidentReport) {
  const [reviewerNote, setReviewerNote] = useState(report.reviewer_note);
  const [status, setStatus] = useState(report.status);

  return (
    <div style={{ margin: 20 }}>
      <h1 style={{ textAlign: "center" }}>{report.report_id}</h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <ImagePanel
          label="Defective part photo"
          url={report.image_url}
          labelAlign="right"
        />
        <ImagePanel label="Reference part photo" url={report.reference_image_url} />
      </div>

      <div style={{ display: "flex" }}>
        <p style={{ width: "50%", margin: 20, textAlign: "right" }}>
          {DETAIL_FIELDS.map((field) => (
            <span key={field} style={{ display: "block" }}>
              <strong>{formatFieldName(field)}</strong>:{" "}
              {formatFieldValue(field, report)}
            </span>
          ))}
        </p>

        <div style={{ width: "50%", margin: 20 }}>
          <label style={{ display: "block", marginBottom: 16 }}>
            <div style={{ fontWeight: "bold", marginBottom: 4 }}>Reviewer note</div>
            <textarea
              value={reviewerNote}
              onChange={(e) => setReviewerNote(e.target.value)}
              rows={4}
              style={{ width: IMAGE_SIZE }}
            />
          </label>

          <label style={{ display: "block", marginBottom: 16 }}>
            <div style={{ fontWeight: "bold", marginBottom: 4 }}>Status</div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ReviewStatus)}
            >
              {Object.values(ReviewStatus).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <button type="button" disabled={status === ReviewStatus.UNREVIEWED}>
            Submit review
          </button>
        </div>
      </div>
    </div>
  );
}
