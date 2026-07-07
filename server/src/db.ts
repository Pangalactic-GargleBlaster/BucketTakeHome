import Database from "better-sqlite3";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { DefectReport } from "../../types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, "../db.sqlite");

export const db = new Database(dbPath);

type DefectReportRow = {
  report_id: string;
  part_name: string;
  part_id: string;
  defect_type: DefectReport["defect_type"];
  severity: DefectReport["severity"];
  confidence: number;
  status: DefectReport["status"];
  station: string;
  created_at: string;
  finding_summary: string;
  reviewer_note: string;
  image_url: string;
  reference_image_url: string;
};

function rowToDefectReport(row: DefectReportRow): DefectReport {
  return {
    ...row,
    created_at: new Date(row.created_at),
  };
}

const selectAllStmt = db.prepare(`
  SELECT
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
  FROM defect_report
  ORDER BY created_at DESC
`);

const selectByIdStmt = db.prepare(`
  SELECT
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
  FROM defect_report
  WHERE report_id = ?
`);

export function getAllDefectReports(): DefectReport[] {
  return selectAllStmt.all().map((row) => rowToDefectReport(row as DefectReportRow));
}

export function getDefectReportById(reportId: string): DefectReport | undefined {
  const row = selectByIdStmt.get(reportId) as DefectReportRow | undefined;
  return row ? rowToDefectReport(row) : undefined;
}

const upsertStmt = db.prepare(`
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

function defectReportToRow(report: DefectReport): DefectReportRow {
  return {
    ...report,
    created_at:
      report.created_at instanceof Date
        ? report.created_at.toISOString()
        : new Date(report.created_at).toISOString(),
  };
}

export function upsertDefectReport(report: DefectReport): DefectReport {
  upsertStmt.run(defectReportToRow(report));
  return report;
}
