export const IS_PROD = process.env.NODE_ENV === "production";

// cookies
export const COOKIE_NAME = "quickpics-session";
export const COOKIE_SECRET = process.env.COOKIE_SECRET;

// field validations
export const MIN_FIELD_LENGTH = 3;
export const MAX_FIELD_LENGTH = 30; // same as db

// error messages
export const NOT_FOUND = (entity: string) =>
  `That ${entity} could not be found.`;
export const NOT_UNIQUE = (field: string) =>
  `Someone is already using this ${field}.`;
export const BAD_CREDENTIALS = (field: string) => `Invalid ${field}.`;
export const TOO_SHORT = (field: string) =>
  `Your ${field} must be at least ${MIN_FIELD_LENGTH} characters long.`;
export const TOO_LONG = (field: string) =>
  `Your ${field} cannot be greater than ${MAX_FIELD_LENGTH} characters long.`;
export const ALPHANUMERIC_USERNAME =
  "Usernames can only be letters and numbers.";
export const NO_PERMISSION = "You don't have permission to do that.";

export const MAX_TAKE = 50;
