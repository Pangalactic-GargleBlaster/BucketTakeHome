import { useMemo, useState } from "react";

export function StringFilterPicker({
  options,
  selectedValues,
  onSelectedValuesChange,
}: {
  options: ReadonlySet<string>;
  selectedValues: ReadonlySet<string>;
  onSelectedValuesChange: (selectedValues: Set<string>) => void;
}) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [addedOptions, setAddedOptions] = useState<Set<string>>(() => new Set());

  const allOptions = useMemo(
    () => new Set([...options, ...addedOptions]),
    [options, addedOptions],
  );

  const buttonLabel =
    selectedValues.size === 0
      ? "Click to filter"
      : [...selectedValues].join(", ");

  function addValue(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;

    if (!allOptions.has(trimmed)) {
      setAddedOptions((prev) => new Set([...prev, trimmed]));
    }

    if (!selectedValues.has(trimmed)) {
      const nextSelected = new Set(selectedValues);
      nextSelected.add(trimmed);
      onSelectedValuesChange(nextSelected);
    }

    setInputValue("");
  }

  function toggleOption(value: string) {
    const nextSelected = new Set(selectedValues);
    if (nextSelected.has(value)) {
      nextSelected.delete(value);
    } else {
      nextSelected.add(value);
    }
    onSelectedValuesChange(nextSelected);
  }

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        style={{
          width: 200,
          height: 20,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {buttonLabel}
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
              height: 300,
              marginTop: 4,
              border: "1px solid black",
              backgroundColor: "white",
              display: "flex",
              flexDirection: "column",
              padding: 8,
              boxSizing: "border-box",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="text"
              placeholder="enter a value"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addValue(inputValue);
                }
              }}
              style={{ width: "100%", marginBottom: 8, boxSizing: "border-box" }}
            />
            <div style={{ overflow: "auto", flex: 1 }}>
              {[...allOptions].sort().map((option) => (
                <label
                  key={option}
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <input
                    type="checkbox"
                    checked={selectedValues.has(option)}
                    onChange={() => toggleOption(option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
