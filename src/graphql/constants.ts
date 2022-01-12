export const MIN_FIELD_LENGTH = 3;

export const NOT_FOUND = (entity: string) =>
  `That ${entity} could not be found`;
export const NOT_UNIQUE = (field: string) =>
  `Someone is already using this ${field}`;
export const BAD_CREDENTIALS = (field: string) => `Invalid ${field}`;
export const TOO_SHORT = (field: string) =>
  `Your ${field} must be at least ${MIN_FIELD_LENGTH} characters long`;
