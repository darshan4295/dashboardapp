/**
 * DDManager.js
 * ExtJS implementation of the DDManager class
 * Globals that are shared across Drag & Drop instances
 */

Ext.define('DDManager', {
  singleton: true,
  
  // These properties will be available as static properties
  // that can be accessed directly from the class
  
  /**
   * Current drag element being manipulated
   * @property {Object} dragElement
   */
  dragElement: null,
  
  /**
   * Current drop target element
   * @property {Object} dropElement
   */
  dropElement: null,
  
  /**
   * Flag to track if mouse is currently being handled
   * @property {Boolean} mouseHandled
   */
  mouseHandled: false,
  
  /**
   * Flag or number to pause drag operations
   * @property {Boolean|Number} pauseDrag
   */
  pauseDrag: false
});