import { RouterPushError } from '@/errors/routerPushError'
import { RouterRejectionError } from '@/errors/routerRejectionError'
import { RegisteredRouterPush, RegisteredRouterReject, RegisteredRouterReplace } from '@/types/register'
import { RouterPushOptions } from '@/types/routerPush'
import { isUrl } from '@/types/url'

export type CallbackContext = {
  reject: (...args: Parameters<RegisteredRouterReject>) => never,
  push: (...args: Parameters<RegisteredRouterPush>) => never,
  replace: (...args: Parameters<RegisteredRouterReplace>) => never,
}

export function createCallbackContext(): CallbackContext {
  const reject: CallbackContext['reject'] = (type) => {
    throw new RouterRejectionError(type)
  }

  const push: CallbackContext['push'] = (...parameters: any[]) => {
    throw new RouterPushError(parameters)
  }

  const replace: CallbackContext['replace'] = (source: any, paramsOrOptions?: any, maybeOptions?: any) => {
    if (isUrl(source)) {
      const options: RouterPushOptions = paramsOrOptions ?? {}
      throw new RouterPushError([source, { ...options, replace: true }])
    }

    const params = paramsOrOptions
    const options: RouterPushOptions = maybeOptions ?? {}
    throw new RouterPushError([source, params, { ...options, replace: true }])
  }

  return { reject, push, replace }
}