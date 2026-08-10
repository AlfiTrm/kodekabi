import "server-only";

function requiredServerEnv(name: "NEXT_BASE_API") {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required server environment variable: ${name}`);
  }

  return value.replace(/\/+$/, "");
}

export const serverEnv = {
  get apiBaseUrl() {
    return requiredServerEnv("NEXT_BASE_API");
  },
};
