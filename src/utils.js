/**
 * GridStack Utilities 
 * 
 * Class that provides utility functions for GridStack functionality.
 * Includes both static utility methods and deprecated function handlers.
 */

gridDefaults = {
    alwaysShowResizeHandle: "mobile",
    animate: true,
    auto: true,
    cellHeight: "auto",
    cellHeightThrottle: 100,
    cellHeightUnit: "px",
    column: 12,
    draggable: {
      handle: ".grid-stack-item-content",
      appendTo: "body",
      scroll: true
    },
    handle: ".grid-stack-item-content",
    itemClass: "grid-stack-item",
    margin: 10,
    marginUnit: "px",
    maxRow: 0,
    minRow: 0,
    placeholderClass: "grid-stack-placeholder",
    placeholderText: "",
    removableOptions: {
      accept: "grid-stack-item",
      decline: "grid-stack-non-removable"
    },
    resizable: { handles: "se" },
    rtl: "auto"
  
    // **** same as not being set ****
    // disableDrag: false,
    // disableResize: false,
    // float: false,
    // handleClass: null,
    // removable: false,
    // staticGrid: false,
    //removable
  }
  
  
Ext.define('Utils', {
  singleton: true,

  /**
   * Creates a wrapper function for deprecated methods
   * @param {Object} self - The context object
   * @param {Function} f - The original function
   * @param {String} oldName - The old function name
   * @param {String} newName - The new function name
   * @param {String} rev - The revision where deprecation occurred
   * @return {Function} Wrapped function with warning
   */
  obsolete: function(self, f, oldName, newName, rev) {
      const wrapper = function(...args) {
          console.warn('gridstack.js: Function `' + oldName + '` is deprecated in ' + rev + ' and has been replaced ' +
          'with `' + newName + '`. It will be **removed** in a future release');
          return f.apply(self, args);
      };
      wrapper.prototype = f.prototype;
      return wrapper;
  },

  /**
   * Handles deprecated options by copying to new option name
   * @param {Object} opts - Options object
   * @param {String} oldName - Old option name
   * @param {String} newName - New option name
   * @param {String} rev - Revision where deprecation occurred
   */
  obsoleteOpts: function(opts, oldName, newName, rev) {
      if (opts[oldName] !== undefined) {
          opts[newName] = opts[oldName];
          console.warn('gridstack.js: Option `' + oldName + '` is deprecated in ' + rev + ' and has been replaced with `' +
          newName + '`. It will be **removed** in a future release');
      }
  },

  /**
   * Warns about deprecated options that will be removed
   * @param {Object} opts - Options object
   * @param {String} oldName - Old option name
   * @param {String} rev - Revision where deprecation occurred
   * @param {String} info - Additional information
   */
  obsoleteOptsDel: function(opts, oldName, rev, info) {
      if (opts[oldName] !== undefined) {
          console.warn('gridstack.js: Option `' + oldName + '` is deprecated in ' + rev + info);
      }
  },

  /**
   * Handles deprecated attributes by copying to new attribute name
   * @param {HTMLElement} el - Element to check
   * @param {String} oldName - Old attribute name
   * @param {String} newName - New attribute name
   * @param {String} rev - Revision where deprecation occurred
   */
  obsoleteAttr: function(el, oldName, newName, rev) {
      const oldAttr = el.getAttribute(oldName);
      if (oldAttr !== null) {
          el.setAttribute(newName, oldAttr);
          console.warn('gridstack.js: attribute `' + oldName + '`=' + oldAttr + ' is deprecated on this object in ' + rev + ' and has been replaced with `' +
          newName + '`. It will be **removed** in a future release');
      }
  },

  /**
   * Returns array of DOM elements that match the selector
   * @param {String|Object} els - Selector string or DOM element
   * @param {Object} root - Root element to search from
   * @return {Array} Array of matching elements
   */
  getElements: function(els, root) {
      root = root || document;
      
      if (typeof els === 'string') {
          const doc = ('getElementById' in root) ? root : undefined;

          if (doc && !isNaN(+els[0])) {
              const el = doc.getElementById(els);
              return el ? [el] : [];
          }

          let list = root.querySelectorAll(els);
          if (!list.length && els[0] !== '.' && els[0] !== '#') {
              list = root.querySelectorAll('.' + els);
              if (!list.length) { list = root.querySelectorAll('#' + els) }
          }
          return Array.from(list);
      }
      return [els];
  },

  /**
   * Returns first DOM element that matches the selector
   * @param {String|Object} els - Selector string or DOM element
   * @param {Object} root - Root element to search from
   * @return {Object} Matching DOM element
   */
  getElement: function(els, root) {
      root = root || document;
      
      if (typeof els === 'string') {
          const doc = ('getElementById' in root) ? root : undefined;
          if (!els.length) return null;
          if (doc && els[0] === '#') {
              return doc.getElementById(els.substring(1));
          }
          if (els[0] === '#' || els[0] === '.' || els[0] === '[') {
              return root.querySelector(els);
          }

          if (doc && !isNaN(+els[0])) {
              return doc.getElementById(els);
          }

          let el = root.querySelector(els);
          if (doc && !el) { el = doc.getElementById(els) }
          if (!el) { el = root.querySelector('.' + els) }
          return el;
      }
      return els;
  },

  /**
   * Checks if node should be lazy loaded
   * @param {Object} n - Node to check
   * @return {Boolean} True if should be lazy loaded
   */
  lazyLoad: function(n) {
      return n.lazyLoad || n.grid?.opts?.lazyLoad && n.lazyLoad !== false;
  },

  /**
   * Creates a div element with specified classes
   * @param {Array} classes - CSS classes to add
   * @param {HTMLElement} parent - Optional parent to append to
   * @return {HTMLElement} Created div element
   */
  createDiv: function(classes, parent) {
      const el = document.createElement('div');
      classes.forEach(c => {if (c) el.classList.add(c)});
      if (parent) parent.appendChild(el);
      return el;
  },

  /**
   * Checks if node should size to content
   * @param {Object} n - Node to check
   * @param {Boolean} strict - Whether to use strict checking
   * @return {Boolean} True if should size to content
   */
  shouldSizeToContent: function(n, strict) {
      strict = strict || false;
      return n?.grid && (strict ?
          (n.sizeToContent === true || (n.grid.opts.sizeToContent === true && n.sizeToContent === undefined)) :
          (!!n.sizeToContent || (n.grid.opts.sizeToContent && n.sizeToContent !== false)));
  },

  /**
   * Checks if two rectangles intersect
   * @param {Object} a - First rectangle
   * @param {Object} b - Second rectangle
   * @return {Boolean} True if rectangles intersect
   */
  isIntercepted: function(a, b) {
      return !(a.y >= b.y + b.h || a.y + a.h <= b.y || a.x + a.w <= b.x || a.x >= b.x + b.w);
  },

  /**
   * Checks if two rectangles are touching
   * @param {Object} a - First rectangle
   * @param {Object} b - Second rectangle
   * @return {Boolean} True if rectangles are touching
   */
  isTouching: function(a, b) {
      return this.isIntercepted(a, {x: b.x-0.5, y: b.y-0.5, w: b.w+1, h: b.h+1});
  },

  /**
   * Calculates the area of intersection between two rectangles
   * @param {Object} a - First rectangle
   * @param {Object} b - Second rectangle
   * @return {Number} Area of intersection
   */
  areaIntercept: function(a, b) {
      const x0 = (a.x > b.x) ? a.x : b.x;
      const x1 = (a.x+a.w < b.x+b.w) ? a.x+a.w : b.x+b.w;
      if (x1 <= x0) return 0;
      const y0 = (a.y > b.y) ? a.y : b.y;
      const y1 = (a.y+a.h < b.y+b.h) ? a.y+a.h : b.y+b.h;
      if (y1 <= y0) return 0;
      return (x1-x0) * (y1-y0);
  },

  /**
   * Calculates area of a rectangle
   * @param {Object} a - Rectangle
   * @return {Number} Area
   */
  area: function(a) {
      return a.w * a.h;
  },

  /**
   * Sorts nodes by position
   * @param {Array} nodes - Nodes to sort
   * @param {Number} dir - Direction (1 for asc, -1 for desc)
   * @return {Array} Sorted nodes
   */
  sort: function(nodes, dir) {
      dir = dir || 1;
      const und = 10000;
      return nodes.sort(function(a, b) {
          const diffY = dir * ((a.y ?? und) - (b.y ?? und));
          if (diffY === 0) return dir * ((a.x ?? und) - (b.x ?? und));
          return diffY;
      });
  },

  /**
   * Finds a node by id
   * @param {Array} nodes - Nodes to search
   * @param {String} id - Id to find
   * @return {Object} Found node or undefined
   */
  find: function(nodes, id) {
      return id ? nodes.find(function(n) { return n.id === id; }) : undefined;
  },

  /**
   * Converts value to boolean
   * @param {*} v - Value to convert
   * @return {Boolean} Converted boolean
   */
  toBool: function(v) {
      if (typeof v === 'boolean') {
          return v;
      }
      if (typeof v === 'string') {
          v = v.toLowerCase();
          return !(v === '' || v === 'no' || v === 'false' || v === '0');
      }
      return Boolean(v);
  },

  /**
   * Converts value to number
   * @param {*} value - Value to convert
   * @return {Number} Converted number or undefined
   */
  toNumber: function(value) {
      return (value === null || value.length === 0) ? undefined : Number(value);
  },

  /**
   * Parses height value with unit
   * @param {String|Number} val - Height value
   * @return {Object} Height and unit
   */
  parseHeight: function(val) {
      let h;
      let unit = 'px';
      if (typeof val === 'string') {
          if (val === 'auto' || val === '') h = 0;
          else {
              const match = val.match(/^(-[0-9]+\.[0-9]+|[0-9]*\.[0-9]+|-[0-9]+|[0-9]+)(px|em|rem|vh|vw|%|cm|mm)?$/);
              if (!match) {
                  throw new Error(`Invalid height val = ${val}`);
              }
              unit = match[2] || 'px';
              h = parseFloat(match[1]);
          }
      } else {
          h = val;
      }
      return { h, unit };
  },

  /**
   * Deep assign defaults to target
   * @param {Object} target - Target object
   * @param {...Object} sources - Source objects
   * @return {Object} Target with defaults
   */
  defaults: function(target, ...sources) {
      var me = this;
      sources.forEach(function(source) {
          for (const key in source) {
              if (!source.hasOwnProperty(key)) return;
              if (target[key] === null || target[key] === undefined) {
                  target[key] = source[key];
              } else if (typeof source[key] === 'object' && typeof target[key] === 'object') {
                  me.defaults(target[key], source[key]);
              }
          }
      });

      return target;
  },

  /**
   * Checks if two objects are the same
   * @param {*} a - First object
   * @param {*} b - Second object
   * @return {Boolean} True if objects are the same
   */
  same: function(a, b) {
      if (typeof a !== 'object')  return a == b;
      if (typeof a !== typeof b) return false;
      if (Object.keys(a).length !== Object.keys(b).length) return false;
      for (const key in a) {
          if (a[key] !== b[key]) return false;
      }
      return true;
  },

  /**
   * Copies position data from one object to another
   * @param {Object} a - Target object
   * @param {Object} b - Source object
   * @param {Boolean} doMinMax - Whether to copy min/max values
   * @return {Object} Target object
   */
  copyPos: function(a, b, doMinMax) {
      doMinMax = doMinMax || false;
      if (b.x !== undefined) a.x = b.x;
      if (b.y !== undefined) a.y = b.y;
      if (b.w !== undefined) a.w = b.w;
      if (b.h !== undefined) a.h = b.h;
      if (doMinMax) {
          if (b.minW) a.minW = b.minW;
          if (b.minH) a.minH = b.minH;
          if (b.maxW) a.maxW = b.maxW;
          if (b.maxH) a.maxH = b.maxH;
      }
      return a;
  },

  /**
   * Checks if two positions are the same
   * @param {Object} a - First position
   * @param {Object} b - Second position
   * @return {Boolean} True if positions are the same
   */
  samePos: function(a, b) {
      return a && b && a.x === b.x && a.y === b.y && (a.w || 1) === (b.w || 1) && (a.h || 1) === (b.h || 1);
  },

  /**
   * Sanitizes min/max values of a node
   * @param {Object} node - Node to sanitize
   */
  sanitizeMinMax: function(node) {
      if (!node.minW) { delete node.minW; }
      if (!node.minH) { delete node.minH; }
      if (!node.maxW) { delete node.maxW; }
      if (!node.maxH) { delete node.maxH; }
  },

  /**
   * Removes internal properties and properties that are the same as defaults
   * @param {Object} a - Object to clean
   * @param {Object} b - Default object to compare against
   */
  removeInternalAndSame: function(a, b) {
      var me = this;
      if (typeof a !== 'object' || typeof b !== 'object') return;
      for (let key in a) {
          const aVal = a[key];
          const bVal = b[key];
          if (key[0] === '_' || aVal === bVal) {
              delete a[key];
          } else if (aVal && typeof aVal === 'object' && bVal !== undefined) {
              me.removeInternalAndSame(aVal, bVal);
              if (!Object.keys(aVal).length) { delete a[key]; }
          }
      }
  },

  /**
   * Removes internal properties for saving
   * @param {Object} n - Node to clean
   * @param {Boolean} removeEl - Whether to remove el property
   */
  removeInternalForSave: function(n, removeEl) {
      removeEl = removeEl !== false;
      for (let key in n) { if (key[0] === '_' || n[key] === null || n[key] === undefined ) delete n[key]; }
      delete n.grid;
      if (removeEl) delete n.el;
      if (!n.autoPosition) delete n.autoPosition;
      if (!n.noResize) delete n.noResize;
      if (!n.noMove) delete n.noMove;
      if (!n.locked) delete n.locked;
      if (n.w === 1 || n.w === n.minW) delete n.w;
      if (n.h === 1 || n.h === n.minH) delete n.h;
  },

  /**
   * Creates a throttled function
   * @param {Function} func - Function to throttle
   * @param {Number} delay - Delay in ms
   * @return {Function} Throttled function
   */
  throttle: function(func, delay) {
      let isWaiting = false;
      return function(...args) {
          if (!isWaiting) {
              isWaiting = true;
              setTimeout(function() { 
                  func(...args); 
                  isWaiting = false; 
              }, delay);
          }
      };
  },

  /**
   * Removes positioning styles from an element
   * @param {HTMLElement} el - Element to clean
   */
  removePositioningStyles: function(el) {
      const style = el.style;
      if (style.position) {
          style.removeProperty('position');
      }
      if (style.left) {
          style.removeProperty('left');
      }
      if (style.top) {
          style.removeProperty('top');
      }
      if (style.width) {
          style.removeProperty('width');
      }
      if (style.height) {
          style.removeProperty('height');
      }
  },

  /**
   * Gets the scrolling element for a given element
   * @param {HTMLElement} el - Element to get scrolling element for
   * @return {HTMLElement} Scrolling element
   */
  getScrollElement: function(el) {
      if (!el) return document.scrollingElement || document.documentElement;
      const style = getComputedStyle(el);
      const overflowRegex = /(auto|scroll)/;

      if (overflowRegex.test(style.overflow + style.overflowY)) {
          return el;
      } else {
          return this.getScrollElement(el.parentElement);
      }
  },

  /**
   * Updates scroll position for dragging
   * @param {HTMLElement} el - Element being dragged
   * @param {Object} position - Position object
   * @param {Number} distance - Distance to update
   */
  updateScrollPosition: function(el, position, distance) {
      const rect = el.getBoundingClientRect();
      const innerHeightOrClientHeight = (window.innerHeight || document.documentElement.clientHeight);
      if (rect.top < 0 ||
          rect.bottom > innerHeightOrClientHeight
      ) {
          const offsetDiffDown = rect.bottom - innerHeightOrClientHeight;
          const offsetDiffUp = rect.top;
          const scrollEl = this.getScrollElement(el);
          if (scrollEl !== null) {
              const prevScroll = scrollEl.scrollTop;
              if (rect.top < 0 && distance < 0) {
                  if (el.offsetHeight > innerHeightOrClientHeight) {
                      scrollEl.scrollTop += distance;
                  } else {
                      scrollEl.scrollTop += Math.abs(offsetDiffUp) > Math.abs(distance) ? distance : offsetDiffUp;
                  }
              } else if (distance > 0) {
                  if (el.offsetHeight > innerHeightOrClientHeight) {
                      scrollEl.scrollTop += distance;
                  } else {
                      scrollEl.scrollTop += offsetDiffDown > distance ? distance : offsetDiffDown;
                  }
              }
              position.top += scrollEl.scrollTop - prevScroll;
          }
      }
  },

  /**
   * Updates scroll for resizing
   * @param {Event} event - Mouse event
   * @param {HTMLElement} el - Element being resized
   * @param {Number} distance - Distance to update
   */
  updateScrollResize: function(event, el, distance) {
      const scrollEl = this.getScrollElement(el);
      const height = scrollEl.clientHeight;
      const offsetTop = (scrollEl === this.getScrollElement()) ? 0 : scrollEl.getBoundingClientRect().top;
      const pointerPosY = event.clientY - offsetTop;
      const top = pointerPosY < distance;
      const bottom = pointerPosY > height - distance;

      if (top) {
          scrollEl.scrollBy({ behavior: 'smooth', top: pointerPosY - distance});
      } else if (bottom) {
          scrollEl.scrollBy({ behavior: 'smooth', top: distance - (height - pointerPosY)});
      }
  },

  /**
   * Shallow clones an object
   * @param {Object} obj - Object to clone
   * @return {Object} Cloned object
   */
  clone: function(obj) {
      if (obj === null || obj === undefined || typeof(obj) !== 'object') {
          return obj;
      }
      if (obj instanceof Array) {
          return [...obj];
      }
      return {...obj};
  },

  /**
   * Deep clones an object
   * @param {Object} obj - Object to clone
   * @return {Object} Cloned object
   */
  cloneDeep: function(obj) {
      const skipFields = ['parentGrid', 'el', 'grid', 'subGrid', 'engine'];
      const ret = this.clone(obj);
      for (const key in ret) {
          if (ret.hasOwnProperty(key) && typeof(ret[key]) === 'object' && key.substring(0, 2) !== '__' && !skipFields.find(k => k === key)) {
              ret[key] = this.cloneDeep(obj[key]);
          }
      }
      return ret;
  },

  /**
   * Clones a DOM node
   * @param {HTMLElement} el - Element to clone
   * @return {HTMLElement} Cloned element
   */
  cloneNode: function(el) {
      const node = el.cloneNode(true);
      node.removeAttribute('id');
      return node;
  },

  /**
   * Appends an element to a parent
   * @param {HTMLElement} el - Element to append
   * @param {String|HTMLElement} parent - Parent selector or element
   */
  appendTo: function(el, parent) {
      let parentNode;
      if (typeof parent === 'string') {
          parentNode = this.getElement(parent);
      } else {
          parentNode = parent;
      }
      if (parentNode) {
          parentNode.appendChild(el);
      }
  },

  /**
   * Adds styles to an element
   * @param {HTMLElement} el - Element to style
   * @param {Object} styles - Styles to add
   */
  addElStyles: function(el, styles) {
      if (styles instanceof Object) {
          for (const s in styles) {
              if (styles.hasOwnProperty(s)) {
                  if (Array.isArray(styles[s])) {
                      styles[s].forEach(function(val) {
                          el.style[s] = val;
                      });
                  } else {
                      el.style[s] = styles[s];
                  }
              }
          }
      }
  },

  /**
   * Initializes an event object
   * @param {Event} e - Source event
   * @param {Object} info - Event info
   * @return {Object} Initialized event object
   */
  initEvent: function(e, info) {
      const evt = { type: info.type };
      const obj = {
          button: 0,
          which: 0,
          buttons: 1,
          bubbles: true,
          cancelable: true,
          target: info.target ? info.target : e.target
      };
      ['altKey','ctrlKey','metaKey','shiftKey'].forEach(function(p) { evt[p] = e[p]; });
      ['pageX','pageY','clientX','clientY','screenX','screenY'].forEach(function(p) { evt[p] = e[p]; });
      return {...evt, ...obj};
  },

  /**
   * Simulates a mouse event
   * @param {Event} e - Source event
   * @param {String} simulatedType - Type of event to simulate
   * @param {HTMLElement} target - Target element
   */
  simulateMouseEvent: function(e, simulatedType, target) {
      const me = e;
      const simulatedEvent = new MouseEvent(simulatedType, {
          bubbles: true,
          composed: true,
          cancelable: true,
          view: window,
          detail: 1,
          screenX: e.screenX,
          screenY: e.screenY,
          clientX: e.clientX,
          clientY: e.clientY,
          ctrlKey: me.ctrlKey??false,
          altKey: me.altKey??false,
          shiftKey: me.shiftKey??false,
          metaKey: me.metaKey??false,
          button: 0,
          relatedTarget: e.target
      });

      (target || e.target).dispatchEvent(simulatedEvent);
  },

  /**
   * Gets transform values from an element
   * @param {HTMLElement} parent - Parent element
   * @return {Object} Transform values
   */
  getValuesFromTransformedElement: function(parent) {
      const transformReference = document.createElement('div');
      this.addElStyles(transformReference, {
          opacity: '0',
          position: 'fixed',
          top: 0 + 'px',
          left: 0 + 'px',
          width: '1px',
          height: '1px',
          zIndex: '-999999',
      });
      parent.appendChild(transformReference);
      const transformValues = transformReference.getBoundingClientRect();
      parent.removeChild(transformReference);
      transformReference.remove();
      return {
          xScale: 1 / transformValues.width,
          yScale: 1 / transformValues.height,
          xOffset: transformValues.left,
          yOffset: transformValues.top,
      };
  },

  /**
   * Swaps two properties in an object
   * @param {Object} o - Object to modify
   * @param {String} a - First property
   * @param {String} b - Second property
   */
  swap: function(o, a, b) {
      if (!o) return;
      const tmp = o[a]; o[a] = o[b]; o[b] = tmp;
  },

  /**
   * Checks if a node can be rotated
   * @param {Object} n - Node to check
   * @return {Boolean} True if node can be rotated
   */
  canBeRotated: function(n) {
      return !(!n || n.w === n.h || n.locked || n.noResize || n.grid?.opts.disableResize || (n.minW && n.minW === n.maxW) || (n.minH && n.minH === n.maxH));
  }
});