export enum DefectType {
  CRACK = "crack",
  POROSITY = "porosity",
  MISSING_FEATURE = "missing feature",
  SURFACE_DENT = "surface dent",
  DIMENSIONAL_MISMATCH = "dimensional mismatch",
  CONTAMINATION = "contamination",
  UNKNOWN = "unknown",
}

export enum SeverityLevel {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export enum ReviewStatus {
  UNREVIEWED = "unreviewed",
  PART_ACCEPTED = "part accepted",
  PART_DISCARDED = "part discarded",
  WAITING_FOR_RERUN = "waiting for rerun",
  WAITING_FOR_IN_PERSON_REVIEW = "waiting for in-person review",
}

export type IncidentReport = {
  report_id: string;
  part_name: string;
  part_id: string;
  defect_type: DefectType;
  severity: SeverityLevel;
  confidence: number;
  status: ReviewStatus;
  station: string;
  created_at: Date;
  finding_summary: string;
  reviewer_note: string;
  image_url: string;
  reference_image_url: string;
};
