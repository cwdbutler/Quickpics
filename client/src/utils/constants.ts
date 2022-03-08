export const MIN_FILE_SIZE = 5_000; // 5KB
export const MAX_FILE_SIZE = 5_000_000; // 5MB
export const MAX_FILES = 1;
export const MAX_TEXT_LENGTH = 2_200;
export const MAX_USERNAME_LENGTH = 30;
export const MIN_PASSWORD_LENGTH = 3;
export const MAX_PASSWORD_LENGTH = 100;

export const API_URL = process.env.API_URL || "http://localhost:4000/graphql";
// this is set in production

export const FEED_TAKE = 5;
// the amount of posts to take at a time on the homepage

export const BLUR_PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjePv27X8ACVkDx01U27cAAAAASUVORK5CYII=";
