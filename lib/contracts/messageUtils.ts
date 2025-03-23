/**
 * Utilities for handling message encoding/decoding for the MessageStorage contract
 */

/**
 * Converts a UTF-8 string to bytes
 * @param text The text to convert
 * @returns The text as bytes array
 */
export function utf8StringToBytes(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

/**
 * Formats a message for the contract
 * @param message The message text
 * @returns Text padded to 60 characters
 */
export function formatMessage(message: string): string {
  // The contract requires exactly 60 characters
  return message.padEnd(60, " ").substring(0, 60);
}

/**
 * Parse bytes array to a string, removing null terminators
 * @param bytes The bytes array to parse
 * @returns The parsed string
 */
export function bytesToString(bytes: Uint8Array): string {
  const text = new TextDecoder().decode(bytes);
  return text.trim().replace(/\0/g, ""); // Remove null terminators
}
