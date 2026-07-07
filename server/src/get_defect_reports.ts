import type { DefectReport } from "../../types.js";
import { getAllDefectReports } from "./db.js";

export function get_defect_reports(): DefectReport[] {
  return getAllDefectReports();
}
