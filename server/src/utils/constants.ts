export const IS_PROD = process.env.NODE_ENV === "production";

export const PORT = process.env.PORT;

// cookies
export const COOKIE_NAME = "quickpics-session";
export const COOKIE_SECRET = process.env.COOKIE_SECRET;

// field validations
export const MIN_FIELD_LENGTH = 3;
export const MIN_USERNAME_LENGTH = 1;
export const MAX_USERNAME_LENGTH = 30; // same as db
export const MAX_TEXT_FIELD_LENGTH = 2_200;

// error messages
export const NOT_FOUND = (entity: string) =>
  `That ${entity} could not be found`;
export const NOT_UNIQUE = (field: string) =>
  `Someone is already using this ${field}`;
export const BAD_CREDENTIALS = "Invalid username or email";
export const BAD_PASSWORD = "Invalid password";
export const TOO_SHORT = (length: string) =>
  `Must be at least ${length} characters long`;
export const USERNAME_TOO_LONG = `Your username cannot be greater than ${MAX_USERNAME_LENGTH} characters long`;
export const ALPHANUMERIC_USERNAME =
  "Usernames can only be letters and numbers";
export const NO_PERMISSION = "You don't have permission to do that";
export const TEXT_TOO_LONG = `The maximum length is ${MAX_TEXT_FIELD_LENGTH}`;
export const INVALID_EMAIL = "Invalid email";
export const FORBIDDEN_USERNAME = "That username is not allowed";

// names of routes on client
export const FORBIDDEN_USERNAMES = [
  "create",
  "p",
  "register",
  "login",
  "saved",
];

// post pagination
export const MAX_TAKE = 50;
