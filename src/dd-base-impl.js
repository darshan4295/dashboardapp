export class DDBaseImplement {
  /** returns the enable state, but you have to call enable()/disable() to change (as other things need to happen) */
  get disabled() {
    return this._disabled
  }

  /** @internal */
  _eventRegister = {}

  on(event, callback) {
    this._eventRegister[event] = callback
  }

  off(event) {
    delete this._eventRegister[event]
  }

  enable() {
    this._disabled = false
  }

  disable() {
    this._disabled = true
  }

  destroy() {
    delete this._eventRegister
  }

  triggerEvent(eventName, event) {
    if (!this.disabled && this._eventRegister && this._eventRegister[eventName])
      return this._eventRegister[eventName](event)
  }
}
