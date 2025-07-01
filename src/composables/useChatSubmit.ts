import { onMounted, onBeforeUnmount } from 'vue'

type SubmitCallback = () => void

export function useChatSubmit(
  componentRef: Ref<ComponentPublicInstance>,
  callback: SubmitCallback
) {
  let textareaEl: HTMLTextAreaElement | null = null

  const handler = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      if (document.activeElement === textareaEl) {
        e.preventDefault()
        callback()
      }
    }
  }

  onMounted(() => {
    if (componentRef.value?.$el) {
      textareaEl = componentRef.value.$el.querySelector('textarea')
    }
    window.addEventListener('keydown', handler)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handler)
  })
}
