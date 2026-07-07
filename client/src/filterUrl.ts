export type StringFilterField =
  | "part_name"
  | "defect_type"
  | "severity"
  | "status"
  | "station";

export type SortField =
  | "part_name"
  | "defect_type"
  | "severity"
  | "status"
  | "station"
  | "confidence"
  | "created_at";

export type SortDirection = "asc" | "desc";

export type FilterState = {
  part_name: Set<string>;
  defect_type: Set<string>;
  severity: Set<string>;
  status: Set<string>;
  station: Set<string>;
  confidenceLower: number;
  confidenceUpper: number;
  createdAtStart: Date | null;
  createdAtEnd: Date | null;
  sortBy: SortField;
  sortDirection: SortDirection;
};

export const SORT_FIELDS: SortField[] = [
  "part_name",
  "defect_type",
  "severity",
  "status",
  "station",
  "confidence",
  "created_at",
];

const DEFAULT_SORT_BY: SortField = "created_at";
const DEFAULT_SORT_DIRECTION: SortDirection = "desc";

function isSortField(value: string): value is SortField {
  return (SORT_FIELDS as string[]).includes(value);
}

function isSortDirection(value: string): value is SortDirection {
  return value === "asc" || value === "desc";
}

const STRING_FILTER_FIELDS: StringFilterField[] = [
  "part_name",
  "defect_type",
  "severity",
  "status",
  "station",
];

function readStringSet(params: URLSearchParams, key: string): Set<string> {
  const values = params.getAll(key);
  return values.length > 0 ? new Set(values) : new Set();
}

function readOptionalDate(params: URLSearchParams, key: string): Date | null {
  const value = params.get(key);
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function readOptionalNumber(params: URLSearchParams, key: string): number | null {
  const value = params.get(key);
  if (value === null) return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

export function readFiltersFromUrl(
  params = new URLSearchParams(window.location.search),
): FilterState {
  return {
    part_name: readStringSet(params, "part_name"),
    defect_type: readStringSet(params, "defect_type"),
    severity: readStringSet(params, "severity"),
    status: readStringSet(params, "status"),
    station: readStringSet(params, "station"),
    confidenceLower: readOptionalNumber(params, "confidence_lower") ?? 0,
    confidenceUpper: readOptionalNumber(params, "confidence_upper") ?? 1,
    createdAtStart: readOptionalDate(params, "created_at_start"),
    createdAtEnd: readOptionalDate(params, "created_at_end"),
    sortBy:
      (() => {
        const value = params.get("sort_by");
        return value && isSortField(value) ? value : DEFAULT_SORT_BY;
      })(),
    sortDirection:
      (() => {
        const value = params.get("sort_direction");
        return value && isSortDirection(value)
          ? value
          : DEFAULT_SORT_DIRECTION;
      })(),
  };
}

export function buildHomeFilterUrl(
  field: StringFilterField,
  value: string,
): string {
  const params = new URLSearchParams();
  params.append(field, value);
  return `/?${params.toString()}`;
}

export function writeFiltersToUrl(filters: FilterState) {
  const params = new URLSearchParams();

  for (const field of STRING_FILTER_FIELDS) {
    for (const value of filters[field]) {
      params.append(field, value);
    }
  }

  if (filters.confidenceLower !== 0) {
    params.set("confidence_lower", String(filters.confidenceLower));
  }
  if (filters.confidenceUpper !== 1) {
    params.set("confidence_upper", String(filters.confidenceUpper));
  }
  if (filters.createdAtStart) {
    params.set("created_at_start", filters.createdAtStart.toISOString());
  }
  if (filters.createdAtEnd) {
    params.set("created_at_end", filters.createdAtEnd.toISOString());
  }
  if (filters.sortBy !== DEFAULT_SORT_BY) {
    params.set("sort_by", filters.sortBy);
  }
  if (filters.sortDirection !== DEFAULT_SORT_DIRECTION) {
    params.set("sort_direction", filters.sortDirection);
  }

  const query = params.toString();
  const url = query
    ? `${window.location.pathname}?${query}`
    : window.location.pathname;
  window.history.replaceState(null, "", url);
}
