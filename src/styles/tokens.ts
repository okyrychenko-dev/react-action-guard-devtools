export const COLORS = {
  bgHover: "var(--ag-bg-hover)",
  bgLight: "var(--ag-bg-light)",
  primary: "var(--ag-primary)",
  success: "var(--ag-success)",
  textDim: "var(--ag-text-dim)",
  textMuted: "var(--ag-text-muted)",
  warning: "var(--ag-warning)",
} as const;

export const ACTION_COLORS: Record<string, string> = {
  add: "rgb(var(--ag-success-rgb))",
  remove: "rgb(var(--ag-error-rgb))",
  update: "rgb(var(--ag-info-rgb))",
  cancel: "rgb(var(--ag-warning-rgb))",
  timeout: "rgb(var(--ag-warning-rgb))",
};

export const ACTION_COLOR_BACKGROUNDS: Record<string, string> = {
  add: "rgb(var(--ag-success-rgb) / 0.13)",
  remove: "rgb(var(--ag-error-rgb) / 0.13)",
  update: "rgb(var(--ag-info-rgb) / 0.13)",
  cancel: "rgb(var(--ag-warning-rgb) / 0.13)",
  timeout: "rgb(var(--ag-warning-rgb) / 0.13)",
};

export const MUTED_COLOR_BACKGROUND = "rgb(var(--ag-text-muted-rgb) / 0.13)";
