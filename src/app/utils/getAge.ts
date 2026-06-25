import ms, { StringValue } from "ms";

const getAge = (
  envValue: string | undefined,
  unit: "s" | "ms",
  fallback: number,
): number => {
  // If the environment variable is not set, return the fallback value
  if (!envValue) return fallback;

  // Clean the value by removing comments and trimming whitespace
  const cleanValue = envValue.split("#")[0].trim();
  // Use the ms library to parse the cleaned value
  const parsedMs = ms(cleanValue as StringValue);

  // If parsing fails completely, return the fallback value safely
  if (parsedMs === undefined || isNaN(parsedMs)) {
    return fallback;
  }

  // Return based on requested unit
  return unit === "s" ? Math.floor(parsedMs / 1000) : parsedMs;
};

export default getAge;
