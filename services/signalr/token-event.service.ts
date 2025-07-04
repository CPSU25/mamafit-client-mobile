class TokenEventService {
  private listeners = new Map<string, ((...args: any[]) => void)[]>()

  on(event: string, callback: (...args: any[]) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)!.push(callback)
  }

  off(event: string, callback: (...args: any[]) => void) {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      const index = eventListeners.indexOf(callback)
      if (index > -1) eventListeners.splice(index, 1)
    }
  }

  emit(event: string, ...args: any[]) {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      eventListeners.forEach((callback) => callback(...args))
    }
  }
}

const tokenEventService = new TokenEventService()
export default tokenEventService
