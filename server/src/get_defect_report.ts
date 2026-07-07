import {
  DefectType,
  DefectReport,
  ReviewStatus,
  SeverityLevel,
} from "../../types.js";

export function get_defect_report(_report_id: string): DefectReport {
  return {
    report_id: "DR-2026-001",
    part_name: "Turbine Blade A",
    part_id: "TB-A-1042",
    defect_type: DefectType.CRACK,
    severity: SeverityLevel.CRITICAL,
    confidence: 0.94,
    status: ReviewStatus.UNREVIEWED,
    station: "CMM-03",
    created_at: new Date("2026-07-05T14:22:00Z"),
    finding_summary:
      "Hairline crack detected along the leading edge, approximately 2.3 mm in length.",
    reviewer_note: "",
    image_url: "/images/20260703_185504.jpg",
    reference_image_url: "/images/20260703_185525.jpg",
  };
}
