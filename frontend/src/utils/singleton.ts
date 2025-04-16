// biome-ignore lint/suspicious/noExplicitAny: <explanation>
// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
export function Singleton<T extends new (...args: any[]) => any>(constructor: T) {
  return class extends constructor {
    private static _instance: InstanceType<T>

    constructor(...args: any[]) {
      if (!(constructor as any)._instance) {
        super(...args)
        ;(constructor as any)._instance = this
      }
      return (constructor as any)._instance
    }
  }
}
