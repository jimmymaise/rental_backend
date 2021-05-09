import sanitizeHtmlCore from 'sanitize-html';

export function sanitizeHtml(input) {
  return sanitizeHtmlCore(input.value);
}
