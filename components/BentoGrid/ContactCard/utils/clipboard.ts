// components/contact/ContactCard/utils/clipboard.ts
export const copyToClipboard = async (
  text: string
): Promise<"modern" | "legacy"> => {
  // Modern clipboard API
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return "modern";
  }

  // Fallback for older browsers
  await fallbackCopyText(text);
  return "legacy";
};

const fallbackCopyText = (text: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (successful) {
        resolve();
      } else {
        reject(new Error("Fallback copy failed"));
      }
    } catch (err) {
      document.body.removeChild(textArea);
      reject(err);
    }
  });
};

export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email) && email.length <= 254;
};
