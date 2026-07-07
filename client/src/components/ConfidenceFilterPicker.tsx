import { useState } from "react";

const BUTTON_STYLE = {
  width: 200,
  height: 20,
  overflow: "hidden" as const,
  textOverflow: "ellipsis" as const,
  whiteSpace: "nowrap" as const,
};

function formatConfidence(value: number): string {
  return value.toFixed(2);
}

export function ConfidenceFilterPicker({
  lower,
  upper,
  onLowerChange,
  onUpperChange,
}: {
  lower: number;
  upper: number;
  onLowerChange: (lower: number) => void;
  onUpperChange: (upper: number) => void;
}) {
  const [open, setOpen] = useState(false);

  function handleLowerChange(value: number) {
    onLowerChange(value);
    if (value > upper) {
      onUpperChange(value);
    }
  }

  function handleUpperChange(value: number) {
    onUpperChange(value);
    if (value < lower) {
      onLowerChange(value);
    }
  }

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        style={BUTTON_STYLE}
      >
        {lower === 0 && upper === 1
          ? "Click to filter"
          : `${formatConfidence(lower)} - ${formatConfidence(upper)}`}
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
              <div style={{ fontWeight: "bold", marginBottom: 4 }}>
                Lower ({formatConfidence(lower)})
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={lower}
                onChange={(e) => handleLowerChange(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </label>
            <label style={{ display: "block" }}>
              <div style={{ fontWeight: "bold", marginBottom: 4 }}>
                Upper ({formatConfidence(upper)})
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={upper}
                onChange={(e) => handleUpperChange(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </label>
          </div>
        </>
      )}
    </div>
  );
}
