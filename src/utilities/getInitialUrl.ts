import { isBrowser } from '@/utilities/isBrowser'

export function getInitialUrl(initialUrl?: string): string {
  if (initialUrl) {
    return initialUrl
  }

  if (isBrowser()) {
    return window.location.toString()
  }

  throw new Error('initialUrl must be set if window.location is unavailable')
}