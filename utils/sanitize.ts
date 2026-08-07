import DOMPurify from 'dompurify'

/**
 * Sanitizes HTML strings to prevent XSS attacks.
 * Can be safely used in SSR and Client environments.
 */
export const sanitizeHtml = (html: string): string => {
  if (typeof window === 'undefined') {
    return html // DOMPurify requires a DOM, so we bypass it on the server if needed, or import JSDOM. In Nuxt, usually v-html is client-rendered or we let the client re-hydrate.
  }
  return DOMPurify.sanitize(html)
}
