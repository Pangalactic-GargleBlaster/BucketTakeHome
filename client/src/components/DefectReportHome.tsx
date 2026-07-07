import { useMemo, useState } from "react";
import type { DefectReport } from "../../../types";
import { DefectReportList } from "./DefectReportList";
import { StringFilterPicker } from "./StringFilterPicker";
import { DatetimeFilterPicker } from "./DatetimeFilterPicker";
import { ConfidenceFilterPicker } from "./ConfidenceFilterPicker";
import {
  readFiltersFromUrl,
  writeFiltersToUrl,
  type FilterState,
  type StringFilterField,
} from "../filterUrl";

const STRING_FILTERS: { field: StringFilterField; label: string }[] = [
  { field: "part_name", label: "part name" },
  { field: "defect_type", label: "defect type" },
  { field: "severity", label: "severity" },
  { field: "status", label: "status" },
  { field: "station", label: "station" },
];

function collectOptions(
  reports: DefectReport[],
  field: StringFilterField,
): Set<string> {
  return new Set(reports.map((report) => String(report[field])));
}

function applyFilters(
  reports: DefectReport[],
  filters: FilterState,
): DefectReport[] {
  return reports.filter((report) => {
    for (const { field } of STRING_FILTERS) {
      const selected = filters[field];
      if (selected.size > 0 && !selected.has(String(report[field]))) {
        return false;
      }
    }

    if (
      filters.confidenceLower > 0 ||
      filters.confidenceUpper < 1
    ) {
      if (
        report.confidence < filters.confidenceLower ||
        report.confidence > filters.confidenceUpper
      ) {
        return false;
      }
    }

    const createdAt = new Date(report.created_at);
    if (filters.createdAtStart && createdAt < filters.createdAtStart) {
      return false;
    }
    if (filters.createdAtEnd && createdAt > filters.createdAtEnd) {
      return false;
    }

    return true;
  });
}

export function DefectReportHome({
  reports,
}: {
  reports: DefectReport[];
}) {
  const [filters, setFilters] = useState(() => readFiltersFromUrl());

  const options = useMemo(
    () =>
      Object.fromEntries(
        STRING_FILTERS.map(({ field }) => [
          field,
          collectOptions(reports, field),
        ]),
      ) as Record<StringFilterField, Set<string>>,
    [reports],
  );

  const filteredReports = useMemo(
    () => applyFilters(reports, filters),
    [reports, filters],
  );

  function updateFilters(patch: Partial<FilterState>) {
    setFilters((prev) => {
      const next = { ...prev, ...patch };
      writeFiltersToUrl(next);
      return next;
    });
  }

  return (
    <div style={{ display: "flex" }}>
      <aside
        style={{
          width: "fit-content",
          padding: 16,
          flexShrink: 0,
          borderRight: "1px solid black",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: 16 }}>Filters</h2>
        {STRING_FILTERS.map(({ field, label }) => (
          <div key={field} style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: "bold", marginBottom: 4 }}>{label}</div>
            <StringFilterPicker
              options={options[field]}
              selectedValues={filters[field]}
              onSelectedValuesChange={(selectedValues) =>
                updateFilters({ [field]: selectedValues })
              }
            />
          </div>
        ))}

        <div style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: "bold", marginBottom: 4 }}>confidence</div>
          <ConfidenceFilterPicker
            lower={filters.confidenceLower}
            upper={filters.confidenceUpper}
            onLowerChange={(confidenceLower) =>
              updateFilters({ confidenceLower })
            }
            onUpperChange={(confidenceUpper) =>
              updateFilters({ confidenceUpper })
            }
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: "bold", marginBottom: 4 }}>created at</div>
          <DatetimeFilterPicker
            start={filters.createdAtStart}
            end={filters.createdAtEnd}
            onStartChange={(createdAtStart) =>
              updateFilters({ createdAtStart })
            }
            onEndChange={(createdAtEnd) => updateFilters({ createdAtEnd })}
          />
        </div>
      </aside>

      <main style={{ flex: 1 }}>
        <DefectReportList reports={filteredReports} />
      </main>
    </div>
  );
}
