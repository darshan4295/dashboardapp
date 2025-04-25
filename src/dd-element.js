/**
 * dd-elements.ts 12.1.0-dev
 * Copyright (c) 2021-2024 Alain Dumesny - see GridStack root license
 */
Ext.define('DDElement', {
    statics:{
        init: function(el) {
            if (!el.ddElement) {
                el.ddElement = new DDElement(el)
            }
            return el.ddElement;
      }
    },
    
  
  constructor: function(el) {
    this.el = el
  },

  on: function(eventName, callback) {
    if (
      this.ddDraggable &&
      ["drag", "dragstart", "dragstop"].indexOf(eventName) > -1
    ) {
      this.ddDraggable.on(eventName, callback)
    } else if (
      this.ddDroppable &&
      ["drop", "dropover", "dropout"].indexOf(eventName) > -1
    ) {
      this.ddDroppable.on(eventName, callback)
    } else if (
      this.ddResizable &&
      ["resizestart", "resize", "resizestop"].indexOf(eventName) > -1
    ) {
      this.ddResizable.on(eventName, callback)
    }
    return this
  },

  off: function(eventName) {
    if (
      this.ddDraggable &&
      ["drag", "dragstart", "dragstop"].indexOf(eventName) > -1
    ) {
      this.ddDraggable.off(eventName)
    } else if (
      this.ddDroppable &&
      ["drop", "dropover", "dropout"].indexOf(eventName) > -1
    ) {
      this.ddDroppable.off(eventName)
    } else if (
      this.ddResizable &&
      ["resizestart", "resize", "resizestop"].indexOf(eventName) > -1
    ) {
      this.ddResizable.off(eventName)
    }
    return this
  },

  setupDraggable: function(opts) {
    if (!this.ddDraggable) {
      this.ddDraggable = new DDDraggable(this.el, opts)
    } else {
      this.ddDraggable.updateOption(opts)
    }
    return this
  },

  cleanDraggable: function() {
    if (this.ddDraggable) {
      this.ddDraggable.destroy()
      delete this.ddDraggable
    }
    return this
  },

  setupResizable: function(opts) {
    if (!this.ddResizable) {
      this.ddResizable = new DDResizable(this.el, opts)
    } else {
      this.ddResizable.updateOption(opts)
    }
    return this
  },

  cleanResizable: function() {
    if (this.ddResizable) {
      this.ddResizable.destroy()
      delete this.ddResizable
    }
    return this
  },

  setupDroppable: function(opts) {
    if (!this.ddDroppable) {
      this.ddDroppable = new DDDroppable(this.el, opts)
    } else {
      this.ddDroppable.updateOption(opts)
    }
    return this
  },

  cleanDroppable: function() {
    if (this.ddDroppable) {
      this.ddDroppable.destroy()
      delete this.ddDroppable
    }
    return this
  }
});