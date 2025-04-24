export function obsolete(self, f, oldName, newName, rev) {
  const wrapper = (...args) => {
    console.warn('gridstack.js: Function `' + oldName + '` is deprecated in ' + rev + ' and has been replaced ' +
    'with `' + newName + '`. It will be **removed** in a future release');
    return f.apply(self, args);
  }
  wrapper.prototype = f.prototype;
  return wrapper;
}

export function obsoleteOpts(opts, oldName, newName, rev) {
  if (opts[oldName] !== undefined) {
    opts[newName] = opts[oldName];
    console.warn('gridstack.js: Option `' + oldName + '` is deprecated in ' + rev + ' and has been replaced with `' +
      newName + '`. It will be **removed** in a future release');
  }
}

export function obsoleteOptsDel(opts, oldName, rev, info) {
  if (opts[oldName] !== undefined) {
    console.warn('gridstack.js: Option `' + oldName + '` is deprecated in ' + rev + info);
  }
}

export function obsoleteAttr(el, oldName, newName, rev) {
  const oldAttr = el.getAttribute(oldName);
  if (oldAttr !== null) {
    el.setAttribute(newName, oldAttr);
    console.warn('gridstack.js: attribute `' + oldName + '`=' + oldAttr + ' is deprecated on this object in ' + rev + ' and has been replaced with `' +
      newName + '`. It will be **removed** in a future release');
  }
}

export class Utils {
  static getElements(els, root = document) {
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
  }

  static getElement(els, root = document) {
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
  }

  static lazyLoad(n) {
    return n.lazyLoad || n.grid?.opts?.lazyLoad && n.lazyLoad !== false;
  }

  static createDiv(classes, parent) {
    const el = document.createElement('div');
    classes.forEach(c => {if (c) el.classList.add(c)});
    parent?.appendChild(el);
    return el;
  }

  static shouldSizeToContent(n, strict = false) {
    return n?.grid && (strict ?
      (n.sizeToContent === true || (n.grid.opts.sizeToContent === true && n.sizeToContent === undefined)) :
      (!!n.sizeToContent || (n.grid.opts.sizeToContent && n.sizeToContent !== false)));
  }

  static isIntercepted(a, b) {
    return !(a.y >= b.y + b.h || a.y + a.h <= b.y || a.x + a.w <= b.x || a.x >= b.x + b.w);
  }

  static isTouching(a, b) {
    return Utils.isIntercepted(a, {x: b.x-0.5, y: b.y-0.5, w: b.w+1, h: b.h+1})
  }

  static areaIntercept(a, b) {
    const x0 = (a.x > b.x) ? a.x : b.x;
    const x1 = (a.x+a.w < b.x+b.w) ? a.x+a.w : b.x+b.w;
    if (x1 <= x0) return 0;
    const y0 = (a.y > b.y) ? a.y : b.y;
    const y1 = (a.y+a.h < b.y+b.h) ? a.y+a.h : b.y+b.h;
    if (y1 <= y0) return 0;
    return (x1-x0) * (y1-y0);
  }

  static area(a) {
    return a.w * a.h;
  }

  static sort(nodes, dir = 1) {
    const und = 10000;
    return nodes.sort((a, b) => {
      const diffY = dir * ((a.y ?? und) - (b.y ?? und));
      if (diffY === 0) return dir * ((a.x ?? und) - (b.x ?? und));
      return diffY;
    });
  }

  static find(nodes, id) {
    return id ? nodes.find(n => n.id === id) : undefined;
  }

  static toBool(v) {
    if (typeof v === 'boolean') {
      return v;
    }
    if (typeof v === 'string') {
      v = v.toLowerCase();
      return !(v === '' || v === 'no' || v === 'false' || v === '0');
    }
    return Boolean(v);
  }

  static toNumber(value) {
    return (value === null || value.length === 0) ? undefined : Number(value);
  }

  static parseHeight(val) {
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
  }

  static defaults(target, ...sources) {
    sources.forEach(source => {
      for (const key in source) {
        if (!source.hasOwnProperty(key)) return;
        if (target[key] === null || target[key] === undefined) {
          target[key] = source[key];
        } else if (typeof source[key] === 'object' && typeof target[key] === 'object') {
          this.defaults(target[key], source[key]);
        }
      }
    });

    return target;
  }

  static same(a, b) {
    if (typeof a !== 'object')  return a == b;
    if (typeof a !== typeof b) return false;
    if (Object.keys(a).length !== Object.keys(b).length) return false;
    for (const key in a) {
      if (a[key] !== b[key]) return false;
    }
    return true;
  }

  static copyPos(a, b, doMinMax = false) {
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
  }

  static samePos(a, b) {
    return a && b && a.x === b.x && a.y === b.y && (a.w || 1) === (b.w || 1) && (a.h || 1) === (b.h || 1);
  }

  static sanitizeMinMax(node) {
    if (!node.minW) { delete node.minW; }
    if (!node.minH) { delete node.minH; }
    if (!node.maxW) { delete node.maxW; }
    if (!node.maxH) { delete node.maxH; }
  }

  static removeInternalAndSame(a, b) {
    if (typeof a !== 'object' || typeof b !== 'object') return;
    for (let key in a) {
      const aVal = a[key];
      const bVal = b[key];
      if (key[0] === '_' || aVal === bVal) {
        delete a[key]
      } else if (aVal && typeof aVal === 'object' && bVal !== undefined) {
        Utils.removeInternalAndSame(aVal, bVal);
        if (!Object.keys(aVal).length) { delete a[key] }
      }
    }
  }

  static removeInternalForSave(n, removeEl = true) {
    for (let key in n) { if (key[0] === '_' || n[key] === null || n[key] === undefined ) delete n[key]; }
    delete n.grid;
    if (removeEl) delete n.el;
    if (!n.autoPosition) delete n.autoPosition;
    if (!n.noResize) delete n.noResize;
    if (!n.noMove) delete n.noMove;
    if (!n.locked) delete n.locked;
    if (n.w === 1 || n.w === n.minW) delete n.w;
    if (n.h === 1 || n.h === n.minH) delete n.h;
  }

  static throttle(func, delay) {
    let isWaiting = false;
    return (...args) => {
      if (!isWaiting) {
        isWaiting = true;
        setTimeout(() => { func(...args); isWaiting = false; }, delay);
      }
    }
  }

  static removePositioningStyles(el) {
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
  }

  static getScrollElement(el) {
    if (!el) return document.scrollingElement || document.documentElement;
    const style = getComputedStyle(el);
    const overflowRegex = /(auto|scroll)/;

    if (overflowRegex.test(style.overflow + style.overflowY)) {
      return el;
    } else {
      return this.getScrollElement(el.parentElement);
    }
  }

  static updateScrollPosition(el, position, distance) {
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
  }

  static updateScrollResize(event, el, distance) {
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
  }

  static clone(obj) {
    if (obj === null || obj === undefined || typeof(obj) !== 'object') {
      return obj;
    }
    if (obj instanceof Array) {
      return [...obj];
    }
    return {...obj};
  }

  static cloneDeep(obj) {
    const skipFields = ['parentGrid', 'el', 'grid', 'subGrid', 'engine'];
    const ret = Utils.clone(obj);
    for (const key in ret) {
      if (ret.hasOwnProperty(key) && typeof(ret[key]) === 'object' && key.substring(0, 2) !== '__' && !skipFields.find(k => k === key)) {
        ret[key] = Utils.cloneDeep(obj[key]);
      }
    }
    return ret;
  }

  static cloneNode(el) {
    const node = el.cloneNode(true);
    node.removeAttribute('id');
    return node;
  }

  static appendTo(el, parent) {
    let parentNode;
    if (typeof parent === 'string') {
      parentNode = Utils.getElement(parent);
    } else {
      parentNode = parent;
    }
    if (parentNode) {
      parentNode.appendChild(el);
    }
  }

  static addElStyles(el, styles) {
    if (styles instanceof Object) {
      for (const s in styles) {
        if (styles.hasOwnProperty(s)) {
          if (Array.isArray(styles[s])) {
            styles[s].forEach(val => {
              el.style[s] = val;
            });
          } else {
            el.style[s] = styles[s];
          }
        }
      }
    }
  }

  static initEvent(e, info) {
    const evt = { type: info.type };
    const obj = {
      button: 0,
      which: 0,
      buttons: 1,
      bubbles: true,
      cancelable: true,
      target: info.target ? info.target : e.target
    };
    ['altKey','ctrlKey','metaKey','shiftKey'].forEach(p => evt[p] = e[p]);
    ['pageX','pageY','clientX','clientY','screenX','screenY'].forEach(p => evt[p] = e[p]);
    return {...evt, ...obj};
  }

  static simulateMouseEvent(e, simulatedType, target) {
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
  }

  static getValuesFromTransformedElement(parent) {
    const transformReference = document.createElement('div');
    Utils.addElStyles(transformReference, {
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
    }
  }

  static swap(o, a, b) {
    if (!o) return;
    const tmp = o[a]; o[a] = o[b]; o[b] = tmp;
  }

  static canBeRotated(n) {
    return !(!n || n.w === n.h || n.locked || n.noResize || n.grid?.opts.disableResize || (n.minW && n.minW === n.maxW) || (n.minH && n.minH === n.maxH));
  }
}