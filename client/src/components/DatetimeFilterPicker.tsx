import { useState } from "react";

const BUTTON_STYLE = {
  width: 200,
  height: 20,
  overflow: "hidden" as const,
  textOverflow: "ellipsis" as const,
  whiteSpace: "nowrap" as const,
};

function formatButtonLabel(start: Date | null, end: Date | null): string {
  if (!start && !end) return "Click to filter";
  const startText = start ? start.toLocaleString() : "";
  const endText = end ? end.toLocaleString() : "";
  if (start && end) return `${startText} - ${endText}`;
  if (start) return `${startText} -`;
  return `- ${endText}`;
}

function toDatetimeLocalValue(date: Date | null): string {
  if (!date) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function fromDatetimeLocalValue(value: string): Date | null {
  if (!value) return null;
  return new Date(value);
}

export function DatetimeFilterPicker({
  start,
  end,
  onStartChange,
  onEndChange,
}: {
  start: Date | null;
  end: Date | null;
  onStartChange: (start: Date | null) => void;
  onEndChange: (end: Date | null) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        style={BUTTON_STYLE}
      >
        {formatButtonLabel(start, end)}
      </button>

      {open && (
        <>
          <div
            style={{ position: "fixed", inset: 0 }}
            onClick={() => setOpen(false)}
          />
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              zIndex: 1,
              width: 200,
              marginTop: 4,
              border: "1px solid black",
              backgroundColor: "white",
              display: "flex",
              flexDirection: "column",
              padding: 8,
              boxSizing: "border-box",
              gap: 8,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <label style={{ display: "block" }}>
              <div style={{ fontWeight: "bold", marginBottom: 4 }}>Start</div>
              <input
                type="datetime-local"
                value={toDatetimeLocalValue(start)}
                onChange={(e) =>
                  onStartChange(fromDatetimeLocalValue(e.target.value))
                }
                style={{ width: "100%", boxSizing: "border-box" }}
              />
            </label>
            <label style={{ display: "block" }}>
              <div style={{ fontWeight: "bold", marginBottom: 4 }}>End</div>
              <input
                type="datetime-local"
                value={toDatetimeLocalValue(end)}
                onChange={(e) =>
                  onEndChange(fromDatetimeLocalValue(e.target.value))
                }
                style={{ width: "100%", boxSizing: "border-box" }}
              />
            </label>
          </div>
        </>
      )}
    </div>
  );
}
