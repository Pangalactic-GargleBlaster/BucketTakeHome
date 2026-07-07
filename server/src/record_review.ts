import type { DefectReport } from "../../types.js";
import { upsertDefectReport } from "./db.js";

type DefectReportInput = Omit<DefectReport, "created_at"> & {
  created_at: string | Date;
};

export function record_review(report: DefectReportInput): DefectReport {
  const defectReport: DefectReport = {
    ...report,
    created_at: new Date(report.created_at),
  };

  return upsertDefectReport(defectReport);
}
