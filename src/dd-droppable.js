Ext.define('DDDroppable', {
    extend: 'DDBaseImplement',

  constructor: function(el, option = {}) {
    DDDroppable.callSuper()
    this.el = el
    this.option = option
    // create var event binding so we can easily remove and still look like TS methods (unlike anonymous functions)
    this._mouseEnter = this._mouseEnter.bind(this)
    this._mouseLeave = this._mouseLeave.bind(this)
    this.enable()
    this._setupAccept()
  },

  on: function(event, callback) {
    DDDroppable.superclass.on(event, callback)
  },

  off: function(event) {
    DDDroppable.superclass.off(event)
  },

  enable: function() {
    if (this.disabled === false) return
    DDDroppable.superclass.enable()
    this.el.classList.add("ui-droppable")
    this.el.classList.remove("ui-droppable-disabled")
    this.el.addEventListener("mouseenter", this._mouseEnter)
    this.el.addEventListener("mouseleave", this._mouseLeave)
    if (isTouch) {
      this.el.addEventListener("pointerenter", pointerenter)
      this.el.addEventListener("pointerleave", pointerleave)
    }
  },

  disable: function(forDestroy = false) {
    if (this.disabled === true) return
    DDDroppable.superclass.disable()
    this.el.classList.remove("ui-droppable")
    if (!forDestroy) this.el.classList.add("ui-droppable-disabled")
    this.el.removeEventListener("mouseenter", this._mouseEnter)
    this.el.removeEventListener("mouseleave", this._mouseLeave)
    if (isTouch) {
      this.el.removeEventListener("pointerenter", pointerenter)
      this.el.removeEventListener("pointerleave", pointerleave)
    }
  },

  destroy: function() {
    this.disable(true)
    this.el.classList.remove("ui-droppable")
    this.el.classList.remove("ui-droppable-disabled")
    DDDroppable.superclass.destroy()
  },

  updateOption: function(opts) {
    Object.keys(opts).forEach(key => (this.option[key] = opts[key]))
    this._setupAccept()
    return this
  },

  /** @internal called when the cursor enters our area - prepare for a possible drop and track leaving */
  _mouseEnter: function(e) {
    // console.log(`${count++} Enter ${this.el.id || (this.el as GridHTMLElement).gridstack.opts.id}`); // TEST
    if (!DDManager.dragElement) return
    if (!this._canDrop(DDManager.dragElement.el)) return
    e.preventDefault()
    e.stopPropagation()

    // make sure when we enter this, that the last one gets a leave FIRST to correctly cleanup as we don't always do
    if (DDManager.dropElement && DDManager.dropElement !== this) {
      DDManager.dropElement._mouseLeave(e, true) // calledByEnter = true
    }
    DDManager.dropElement = this

    const ev = Utils.initEvent(e, { target: this.el, type: "dropover" })
    if (this.option.over) {
      this.option.over(ev, this._ui(DDManager.dragElement))
    }
    this.triggerEvent("dropover", ev)
    this.el.classList.add("ui-droppable-over")
    // console.log('tracking'); // TEST
  },

  /** @internal called when the item is leaving our area, stop tracking if we had moving item */
  _mouseLeave: function(e, calledByEnter = false) {
    // console.log(`${count++} Leave ${this.el.id || (this.el as GridHTMLElement).gridstack.opts.id}`); // TEST
    if (!DDManager.dragElement || DDManager.dropElement !== this) return
    e.preventDefault()
    e.stopPropagation()

    const ev = Utils.initEvent(e, { target: this.el, type: "dropout" })
    if (this.option.out) {
      this.option.out(ev, this._ui(DDManager.dragElement))
    }
    this.triggerEvent("dropout", ev)

    if (DDManager.dropElement === this) {
      delete DDManager.dropElement
      // console.log('not tracking'); // TEST

      // if we're still over a parent droppable, send it an enter as we don't get one from leaving nested children
      if (!calledByEnter) {
        let parentDrop
        let parent = this.el.parentElement
        while (!parentDrop && parent) {
          parentDrop = parent.ddElement?.ddDroppable
          parent = parent.parentElement
        }
        if (parentDrop) {
          parentDrop._mouseEnter(e)
        }
      }
    }
  },

  /** item is being dropped on us - called by the drag mouseup handler - this calls the client drop event */
  drop: function(e) {
    e.preventDefault()
    const ev = Utils.initEvent(e, { target: this.el, type: "drop" })
    if (this.option.drop) {
      this.option.drop(ev, this._ui(DDManager.dragElement))
    }
    this.triggerEvent("drop", ev)
  },

  /** @internal true if element matches the string/method accept option */
  _canDrop: function(el) {
    return el && (!this.accept || this.accept(el))
  },

  /** @internal */
  _setupAccept: function() {
    if (!this.option.accept) return this
    if (typeof this.option.accept === "string") {
      this.accept = el =>
        el.classList.contains(this.option.accept) ||
        el.matches(this.option.accept)
    } else {
      this.accept = this.option.accept
    }
    return this
  },

  /** @internal */
  _ui: function(drag) {
    return {
      draggable: drag.el,
      ...drag.ui()
    }
  }
});
