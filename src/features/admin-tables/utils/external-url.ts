/**
 * Xarici URL-i brauzer üçün etibarlı absolut formaya gətirir.
 * `https://` olmadan yazılsa belə (`google.com`, `www...`) `https://` əlavə olunur.
 */
export function toAbsoluteExternalUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) {
    return "";
  }

  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}
