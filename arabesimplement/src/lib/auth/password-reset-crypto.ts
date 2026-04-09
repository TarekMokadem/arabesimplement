import { createHash, randomBytes } from "crypto";

const TOKEN_BYTE_LENGTH = 32;

export function generatePasswordResetPlainToken(): string {
  return randomBytes(TOKEN_BYTE_LENGTH).toString("base64url");
}

export function hashPasswordResetToken(plainToken: string): string {
  return createHash("sha256").update(plainToken, "utf8").digest("hex");
}
