import "server-only";

function requiredServerEnv(name: "NEXT_BASE_API" | "ALIBABA_API_KEY" | "ALIBABA_BASE_URL" | "ALIBABA_IMAGE_URL" | "ALIBABA_TEXT_MODEL" | "ALIBABA_IMAGE_MODEL") {
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
  get alibabaApiKey() {
    return requiredServerEnv("ALIBABA_API_KEY");
  },
  get alibabaBaseUrl() {
    return requiredServerEnv("ALIBABA_BASE_URL");
  },
  get alibabaImageUrl() {
    return requiredServerEnv("ALIBABA_IMAGE_URL");
  },
  get alibabaTextModel() {
    return requiredServerEnv("ALIBABA_TEXT_MODEL");
  },
  get alibabaImageModel() {
    return requiredServerEnv("ALIBABA_IMAGE_MODEL");
  },
};
