import path from "path";

export const domain =
  process.env.NODE_ENV === "development"
    ? path.basename(process.cwd())
    : (process.env.ORIGIN || "").replace(/^https:\/\//, "");
