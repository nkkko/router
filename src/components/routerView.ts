import { AsyncComponentLoader, InjectionKey, computed, defineAsyncComponent, defineComponent, h, inject, provide, resolveComponent } from 'vue'
import { useRouter } from '@/compositions/useRouter'

const depthInjectionKey: InjectionKey<number> = Symbol()

export default defineComponent({
  name: 'RouterView',
  expose: [],
  setup() {
    const router = useRouter()
    const depth = inject(depthInjectionKey, 0)
    const routerView = resolveComponent('RouterView')

    provide(depthInjectionKey, depth + 1)

    const component = computed(() => {
      const routeComponent = router.route.matches[depth].component

      if (routeComponent) {
        if (typeof routeComponent === 'function') {
          return defineAsyncComponent(routeComponent as AsyncComponentLoader)
        }

        return routeComponent
      }

      return routerView
    })

    return () => h(component.value)
  },
})