export const BLOOD_REPORT_SCHEMA = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  type: "object",
  required: ["indicators"],
  properties: {
    reportId: { type: "string" },
    patient: {
      type: "object",
      properties: {
        gender: { enum: ["male", "female"] },
        age: { type: "number", minimum: 0, maximum: 150 },
      },
    },
    indicators: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        required: ["code", "value", "unit"],
        properties: {
          code: { type: "string", pattern: "^[A-Z][A-Z0-9]{1,5}$" },
          name: { type: "string" },
          value: { type: "number" },
          unit: { type: "string" },
          refRange: {
            type: "object",
            properties: {
              min: { type: "number" },
              max: { type: "number" },
            },
            required: ["min", "max"],
          },
        },
      },
    },
  },
} as const;
