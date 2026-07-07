import Database from "better-sqlite3";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  DefectType,
  ReviewStatus,
  SeverityLevel,
} from "../../types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, "../db.sqlite");

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS defect_report (
    report_id TEXT PRIMARY KEY,
    part_name TEXT NOT NULL,
    part_id TEXT NOT NULL,
    defect_type TEXT NOT NULL,
    severity TEXT NOT NULL,
    confidence REAL NOT NULL,
    status TEXT NOT NULL,
    station TEXT NOT NULL,
    created_at TEXT NOT NULL,
    finding_summary TEXT NOT NULL,
    reviewer_note TEXT NOT NULL,
    image_url TEXT NOT NULL,
    reference_image_url TEXT NOT NULL
  )
`);

const insertStmt = db.prepare(`
  INSERT OR REPLACE INTO defect_report (
    report_id,
    part_name,
    part_id,
    defect_type,
    severity,
    confidence,
    status,
    station,
    created_at,
    finding_summary,
    reviewer_note,
    image_url,
    reference_image_url
  ) VALUES (
    @report_id,
    @part_name,
    @part_id,
    @defect_type,
    @severity,
    @confidence,
    @status,
    @station,
    @created_at,
    @finding_summary,
    @reviewer_note,
    @image_url,
    @reference_image_url
  )
`);

type SeedReport = {
  report_id: string;
  part_name: string;
  part_id: string;
  defect_type: DefectType;
  severity: SeverityLevel;
  confidence: number;
  status: ReviewStatus;
  station: string;
  created_at: string;
  finding_summary: string;
  reviewer_note: string;
  image_url: string;
  reference_image_url: string;
};

const baseReports: SeedReport[] = [
  {
    report_id: "DR-2026-001",
    part_name: "Turbine Blade",
    part_id: "TB-A-1042",
    defect_type: DefectType.CRACK,
    severity: SeverityLevel.CRITICAL,
    confidence: 0.94,
    status: ReviewStatus.UNREVIEWED,
    station: "CMM-03",
    created_at: "2026-07-05T14:22:00.000Z",
    finding_summary:
      "Hairline crack detected along the leading edge, approximately 2.3 mm in length.",
    reviewer_note: "",
    image_url: "/images/20260703_185504.jpg",
    reference_image_url: "/images/20260703_185525.jpg",
  },
  {
    report_id: "DR-2026-002",
    part_name: "Housing Cover",
    part_id: "HC-B-0871",
    defect_type: DefectType.POROSITY,
    severity: SeverityLevel.MEDIUM,
    confidence: 0.81,
    status: ReviewStatus.WAITING_FOR_IN_PERSON_REVIEW,
    station: "VIS-01",
    created_at: "2026-07-06T09:15:00.000Z",
    finding_summary:
      "Cluster of micro-porosity near weld seam on the interior surface.",
    reviewer_note: "Needs metallurgist sign-off before disposition.",
    image_url: "/images/20260703_185817.jpg",
    reference_image_url: "/images/20260703_185907.jpg",
  },
  {
    report_id: "DR-2026-003",
    part_name: "Bracket",
    part_id: "BR-C-3310",
    defect_type: DefectType.SURFACE_DENT,
    severity: SeverityLevel.LOW,
    confidence: 0.72,
    status: ReviewStatus.PART_ACCEPTED,
    station: "VIS-02",
    created_at: "2026-07-06T11:40:00.000Z",
    finding_summary:
      "Minor surface dent on non-critical face, within cosmetic tolerance.",
    reviewer_note: "Accepted per cosmetic spec CS-12.",
    image_url: "/images/20260703_185943.jpg",
    reference_image_url: "/images/20260703_190037.jpg",
  },
  {
    report_id: "DR-2026-004",
    part_name: "Shaft",
    part_id: "SH-D-2205",
    defect_type: DefectType.DIMENSIONAL_MISMATCH,
    severity: SeverityLevel.HIGH,
    confidence: 0.89,
    status: ReviewStatus.WAITING_FOR_RERUN,
    station: "CMM-01",
    created_at: "2026-07-07T08:05:00.000Z",
    finding_summary:
      "Bore diameter 0.08 mm undersized relative to drawing tolerance.",
    reviewer_note: "Scheduled for remachining on lathe L-04.",
    image_url: "/images/20260703_190045.jpg",
    reference_image_url: "/images/20260703_190121.jpg",
  },
  {
    report_id: "DR-2026-005",
    part_name: "Seal Ring",
    part_id: "SR-E-1199",
    defect_type: DefectType.CONTAMINATION,
    severity: SeverityLevel.MEDIUM,
    confidence: 0.77,
    status: ReviewStatus.PART_DISCARDED,
    station: "VIS-03",
    created_at: "2026-07-07T10:30:00.000Z",
    finding_summary:
      "Foreign particulate embedded in sealing surface after cleaning cycle.",
    reviewer_note:
      "Discarded — cannot be reworked without compromising seal integrity.",
    image_url: "/images/20260704_163721.jpg",
    reference_image_url: "/images/20260704_163754.jpg",
  },
];

const partNames = [
  "Turbine Blade",
  "Housing Cover",
  "Bracket",
  "Shaft",
  "Seal Ring",
  "Flange Plate",
  "Gear Housing",
  "Valve Body",
  "Impeller",
  "Mounting Plate",
];

const partIdPrefixes = ["TB", "HC", "BR", "SH", "SR", "FP", "GH", "VB", "IM", "MP"];

const stations = ["CMM-01", "CMM-02", "CMM-03", "VIS-01", "VIS-02", "VIS-03"];

const imagePairs = [
  ["/images/20260703_185504.jpg", "/images/20260703_185525.jpg"],
  ["/images/20260703_185817.jpg", "/images/20260703_185907.jpg"],
  ["/images/20260703_185943.jpg", "/images/20260703_190037.jpg"],
  ["/images/20260703_190045.jpg", "/images/20260703_190121.jpg"],
  ["/images/20260704_163721.jpg", "/images/20260704_163754.jpg"],
];

const findingSummaries: Record<DefectType, string[]> = {
  [DefectType.CRACK]: [
    "Hairline crack detected along the leading edge, approximately 2.3 mm in length.",
    "Surface crack observed near mounting hole, extending 1.8 mm radially.",
    "Fatigue crack initiating at fillet radius on the load-bearing surface.",
  ],
  [DefectType.POROSITY]: [
    "Cluster of micro-porosity near weld seam on the interior surface.",
    "Isolated gas pocket visible in cross-section, 0.4 mm diameter.",
    "Scattered pinhole porosity across machined face exceeding visual limit.",
  ],
  [DefectType.MISSING_FEATURE]: [
    "Threaded hole absent at specified location per drawing rev C.",
    "Keyway feature not present on shaft end face.",
    "Counterbore missing on port B, depth gauge reads zero.",
  ],
  [DefectType.SURFACE_DENT]: [
    "Minor surface dent on non-critical face, within cosmetic tolerance.",
    "Handling dent on outer diameter, depth measured at 0.15 mm.",
    "Impact mark on painted surface, no underlying material deformation.",
  ],
  [DefectType.DIMENSIONAL_MISMATCH]: [
    "Bore diameter 0.08 mm undersized relative to drawing tolerance.",
    "Overall length exceeds upper tolerance by 0.12 mm.",
    "Bolt circle pitch deviation of 0.05 mm detected on pattern P-3.",
  ],
  [DefectType.CONTAMINATION]: [
    "Foreign particulate embedded in sealing surface after cleaning cycle.",
    "Oil residue detected on bonding surface post-degreasing.",
    "Metallic chips present in coolant passage after final wash.",
  ],
  [DefectType.UNKNOWN]: [
    "Anomalous surface texture detected, classification uncertain.",
    "Irregular reflectance pattern on finish pass, requires manual review.",
    "Unexpected feature geometry on scanned surface, no matching defect class.",
  ],
};

const reviewerNotes: Record<ReviewStatus, string[]> = {
  [ReviewStatus.UNREVIEWED]: [""],
  [ReviewStatus.PART_ACCEPTED]: [
    "Accepted per cosmetic spec CS-12.",
    "Within engineering concession EC-44.",
    "Deviation approved by quality lead for lot continuation.",
  ],
  [ReviewStatus.PART_DISCARDED]: [
    "Discarded — cannot be reworked without compromising seal integrity.",
    "Scrapped per NCR-1182, material not recoverable.",
    "Rejected due to structural risk on critical load path.",
  ],
  [ReviewStatus.WAITING_FOR_RERUN]: [
    "Scheduled for remachining on lathe L-04.",
    "Queued for CMM re-inspection after rework.",
    "Returned to machining cell for dimensional correction.",
  ],
  [ReviewStatus.WAITING_FOR_IN_PERSON_REVIEW]: [
    "Needs metallurgist sign-off before disposition.",
    "Escalated to senior inspector for visual confirmation.",
    "Pending on-site review by process engineer.",
  ],
};

const defectTypes = Object.values(DefectType);
const severities = Object.values(SeverityLevel);
const statuses = Object.values(ReviewStatus);

function pick<T>(items: T[], index: number): T {
  return items[index % items.length];
}

function confidenceForRecord(index: number, total: number): number {
  if (total <= 1) {
    return 0.1;
  }
  return Number((0.1 + ((index - 1) / (total - 1)) * 0.85).toFixed(2));
}

function generateReports(total: number): SeedReport[] {
  const reports = [...baseReports];
  const startIndex = baseReports.length + 1;

  for (let i = startIndex; i <= total; i++) {
    const prefix = pick(partIdPrefixes, i);
    const defectType = pick(defectTypes, i);
    const severity = pick(severities, i + 2);
    const status = pick(statuses, i + 1);
    const [imageUrl, referenceImageUrl] = pick(imagePairs, i);
    const dayOffset = Math.floor((i - 1) / 3);
    const hour = 8 + (i % 10);
    const minute = (i * 7) % 60;

    reports.push({
      report_id: `DR-2026-${String(i).padStart(3, "0")}`,
      part_name: "",
      part_id: `${prefix}-${1000 + i}`,
      defect_type: defectType,
      severity,
      confidence: 0,
      status,
      station: pick(stations, i),
      created_at: new Date(
        Date.UTC(2026, 6, 1 + dayOffset, hour, minute, 0),
      ).toISOString(),
      finding_summary: pick(findingSummaries[defectType], i),
      reviewer_note: pick(reviewerNotes[status], i),
      image_url: imageUrl,
      reference_image_url: referenceImageUrl,
    });
  }

  return reports.map((report, index) => ({
    ...report,
    part_name: pick(partNames, index),
    confidence: confidenceForRecord(index + 1, total),
  }));
}

const seedReports = generateReports(50);

const insertMany = db.transaction((reports: SeedReport[]) => {
  for (const report of reports) {
    insertStmt.run(report);
  }
});

insertMany(seedReports);

console.log(`Seeded ${seedReports.length} defect reports into ${dbPath}`);
