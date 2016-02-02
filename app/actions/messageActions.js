export const THREAD_SELECTED = 'THREAD_SELECTED'

export function selectThread(index) {
  return { type: THREAD_SELECTED, index }
}
