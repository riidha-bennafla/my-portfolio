// components/BentoGrid/ContactCard/utils/clipboard.ts

// =============================================
// Security Constants
// =============================================
const MAX_TEXT_LENGTH = 10000; // 10KB character limit
const EMAIL_MAX_LENGTH = 254; // RFC 5321 limit

// =============================================
// Clipboard API Implementation
// =============================================
/**
 * Copies text to clipboard using modern API with legacy fallback
 *
 * @param text - Content to copy (max 10,000 characters)
 * @returns {"modern" | "legacy"} Method used
 * @throws {Error} With specific error codes:
 *   - "TEXT_TOO_LONG"
 *   - "NO_CLIPBOARD_ACCESS"
 *   - "FALLBACK_FAILED"
 */
export const copyToClipboard = async (
  text: string
): Promise<"modern" | "legacy"> => {
  // Validate input length
  if (text.length > MAX_TEXT_LENGTH) {
    throw new Error("TEXT_TOO_LONG");
  }

  // Modern clipboard API
  if (navigator.clipboard?.writeText) {
    try {
      // Check permissions if available
      if (navigator.permissions) {
        const status = await navigator.permissions.query({
          name: "clipboard-write" as PermissionName,
        });
        if (status.state !== "granted") {
          throw new Error("CLIPBOARD_PERMISSION_DENIED");
        }
      }

      await navigator.clipboard.writeText(text);
      return "modern";
    } catch (error) {
      console.error("Modern clipboard failed:", error);
      // Fall through to legacy
    }
  }

  // Fallback for older browsers
  return legacyCopyText(text);
};

// =============================================
// Legacy Clipboard Implementation
// =============================================
/**
 * Fallback method using document.execCommand
 *
 * @param text - Sanitized text content
 * @returns {"legacy"} Method indicator
 * @throws {Error} On execution failure
 */
const legacyCopyText = (text: string): Promise<"legacy"> => {
  return new Promise((resolve, reject) => {
    // Check DOM availability
    if (!document.body) {
      return reject(new Error("NO_DOM_ACCESS"));
    }

    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Security and styling
    textArea.setAttribute("readonly", "");
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.opacity = "0";
    textArea.style.pointerEvents = "none";

    document.body.appendChild(textArea);

    try {
      // Select and copy
      textArea.select();
      textArea.setSelectionRange(0, textArea.value.length);

      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (successful) {
        resolve("legacy");
      } else {
        reject(new Error("FALLBACK_FAILED"));
      }
    } catch (err) {
      document.body.removeChild(textArea);
      reject(new Error("EXECUTION_ERROR", { cause: err }));
    }
  });
};

// =============================================
// Email Validation
// =============================================
/**
 * RFC 5322 compliant email validation
 *
 * @param email - Address to validate
 * @returns Validation result
 */
export const isValidEmail = (email: string): boolean => {
  // Length check first (fast fail)
  if (email.length > EMAIL_MAX_LENGTH || email.length < 3) {
    return false;
  }

  // RFC 5322 compliant regex (simplified)
  const regex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  return regex.test(email);
};
