import { customAlphabet } from "nanoid";

// generates a url friendly id string

const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
// removing '=' and '_' from default_

export const createId = customAlphabet(alphabet, 10);
