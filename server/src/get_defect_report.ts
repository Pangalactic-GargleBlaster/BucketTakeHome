import type { DefectReport } from "../../types.js";
import { getDefectReportById } from "./db.js";

export function get_defect_report(report_id: string): DefectReport | undefined {
  return getDefectReportById(report_id);
}
