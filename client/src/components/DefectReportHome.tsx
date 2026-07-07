import { useMemo, useState } from "react";
import type { DefectReport } from "../../../types";
import { SEVERITY_RANK } from "../../../types";
import { DefectReportList } from "./DefectReportList";
import { StringFilterPicker } from "./StringFilterPicker";
import { DatetimeFilterPicker } from "./DatetimeFilterPicker";
import { ConfidenceFilterPicker } from "./ConfidenceFilterPicker";
import {
  readFiltersFromUrl,
  writeFiltersToUrl,
  type FilterState,
  type SortDirection,
  type SortField,
  type StringFilterField,
} from "../filterUrl";

const STRING_FILTERS: { field: StringFilterField; label: string }[] = [
  { field: "part_name", label: "part name" },
  { field: "defect_type", label: "defect type" },
  { field: "severity", label: "severity" },
  { field: "status", label: "status" },
  { field: "station", label: "station" },
];

const SORT_OPTIONS: { field: SortField; label: string }[] = [
  { field: "part_name", label: "part name" },
  { field: "defect_type", label: "defect type" },
  { field: "severity", label: "severity" },
  { field: "status", label: "status" },
  { field: "station", label: "station" },
  { field: "confidence", label: "confidence" },
  { field: "created_at", label: "created at" },
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

function getSortValue(report: DefectReport, sortBy: SortField): string | number {
  if (sortBy === "confidence") {
    return report.confidence;
  }
  if (sortBy === "created_at") {
    return new Date(report.created_at).getTime();
  }
  if (sortBy === "severity") {
    return SEVERITY_RANK[report.severity];
  }
  return String(report[sortBy]);
}

function compareSortValues(a: string | number, b: string | number): number {
  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }
  return String(a).localeCompare(String(b));
}

function applySort(
  reports: DefectReport[],
  sortBy: SortField,
  sortDirection: SortDirection,
): DefectReport[] {
  const direction = sortDirection === "asc" ? 1 : -1;
  return [...reports].sort(
    (a, b) =>
      compareSortValues(getSortValue(a, sortBy), getSortValue(b, sortBy)) *
      direction,
  );
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

  const sortedReports = useMemo(
    () =>
      applySort(filteredReports, filters.sortBy, filters.sortDirection),
    [filteredReports, filters.sortBy, filters.sortDirection],
  );

  function updateFilters(patch: Partial<FilterState>) {
    setFilters((prev) => {
      const next = { ...prev, ...patch };
      writeFiltersToUrl(next);
      return next;
    });
  }

  return (
    <div style={{ display: "flex", height: "95vh" }}>
      <aside 
        style={{
          width: "fit-content",
          padding: 16,
          flexShrink: 0,
          borderRight: "1px solid black",
          overflow: "auto",
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

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block" }}>
            <div style={{ fontWeight: "bold", marginBottom: 4 }}>sort by</div>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                updateFilters({ sortBy: e.target.value as SortField })
              }
              style={{ width: 200 }}
            >
              {SORT_OPTIONS.map(({ field, label }) => (
                <option key={field} value={field}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: "bold", marginBottom: 4 }}>sort direction</div>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="radio"
              name="sort_direction"
              value="asc"
              checked={filters.sortDirection === "asc"}
              onChange={() => updateFilters({ sortDirection: "asc" })}
            />
            ascending
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="radio"
              name="sort_direction"
              value="desc"
              checked={filters.sortDirection === "desc"}
              onChange={() => updateFilters({ sortDirection: "desc" })}
            />
            descending
          </label>
        </div>
      </aside>

      <main style={{ flex: 1, overflow: "auto" }}>
        <h1 style={{ marginTop: 0, marginBottom: 16, marginLeft: 16 }}>Defect Report Review Homepage</h1>
        <DefectReportList reports={sortedReports} />
      </main>
    </div>
  );
}
