export const sanitizeMessage = (input) => {
  if (!input) return "";
  return input
    .replace(/&/g, "&amp;") // escape &
    .replace(/</g, "&lt;") // escape <
    .replace(/>/g, "&gt;") // escape >
    .replace(/"/g, "&quot;") // escape "
    .replace(/'/g, "&#039;") // escape '
    .trim();
};
