import { RouterPushError } from '@/errors/routerPushError'
import { RouterRejectionError } from '@/errors/routerRejectionError'
import { Router } from '@/types/router'
import { RouterPush } from '@/types/routerPush'

export function checkCallbackContext(value: unknown, router: Router): void {
  if (value instanceof RouterPushError) {
    router.push(...value.to as Parameters<RouterPush>)
  }

  if (value instanceof RouterRejectionError) {
    router.reject(value.type)
  }
}