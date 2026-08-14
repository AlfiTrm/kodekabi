export function evidenceDateValue(value?: string) {
  return value ? value.slice(0, 10) : "";
}

export function evidenceDateTimeValue(value?: string) {
  return value ? value.replace(" ", "T").slice(0, 19) : "";
}
