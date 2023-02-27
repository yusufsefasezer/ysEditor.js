(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], function () {
      return factory(root);
    });
  } else if (typeof exports === 'object') {
    module.exports = factory(root);
  } else {
    root.ysEditor = factory(root);
  }
})(typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this, function (window) {

  'use strict';

  //
  // Shared Variables
  //

  var defaults = {
    // Editor wrapper
    wrapper: '#yseditor',

    // Toolbar options
    toolbar: [
      'undo', 'redo', 'bold', 'italic', 'underline',
      'strikethrough', 'h1', 'h2', 'h3', 'p', 'quote',
      'left', 'center', 'right', 'justify',
      'ol', 'ul', 'sub', 'sup',
      'removeformat'],
    bottom: false,

    // Content options
    height: 200,
    scroll: false,
    includeContent: true,

    // Footer options
    footer: true,
    footerText: 'Created by Yusuf Sezer'
  };

  //
  // Predefined button options
  //

  var predefinedButtons = {
    'bold': {
      title: 'Bold',
      command: 'bold',
      text: '<b>B</b>'
    },
    'italic': {
      title: 'Italic',
      command: 'italic',
      text: '<i>I</i>'
    },
    'underline': {
      title: 'Underline',
      command: 'underline',
      text: '<u>U</u>'
    },
    'strikethrough': {
      title: 'Strike through',
      command: 'strikeThrough',
      text: '<strike>S</strike>'
    },
    'left': {
      title: 'Align left',
      command: 'justifyLeft',
      text: 'Left'
    },
    'center': {
      title: 'Align center',
      command: 'justifyCenter',
      text: 'Center'
    },
    'right': {
      title: 'Align right',
      command: 'justifyRight',
      text: 'Right'
    },
    'justify': {
      title: 'Align justify',
      command: 'justifyFull',
      text: 'Justify'
    },
    'sub': {
      title: 'Subscript',
      command: 'subscript',
      text: 'X<sub>2</sub>'
    },
    'sup': {
      title: 'Superscript',
      command: 'superscript',
      text: 'X<sup>2</sub>'
    },
    'ol': {
      title: 'Ordered list',
      command: 'insertOrderedList',
      text: '<b>&#35;</b>'
    },
    'ul': {
      title: 'Unordered list',
      command: 'insertUnorderedList',
      text: '<b>&#8226;</b>'
    },
    'removeformat': {
      title: 'Clear formatting',
      command: 'removeFormat',
      text: 'CF'
    },
    'undo': {
      title: 'Undo',
      command: 'undo',
      text: '&#8630;'
    },
    'redo': {
      title: 'Redo',
      command: 'redo',
      text: '&#8631;'
    },
    'h1': {
      title: 'Heading 1',
      command: 'formatBlock',
      text: 'H1',
      value: 'h1'
    },
    'h2': {
      title: 'Heading 2',
      command: 'formatBlock',
      text: 'H2',
      value: 'h2'
    },
    'h3': {
      title: 'Heading 3',
      command: 'formatBlock',
      text: 'H3',
      value: 'h3'
    },
    'p': {
      title: 'Paragraph',
      command: 'formatBlock',
      text: '&#182;',
      value: 'p'
    },
    'quote': {
      title: 'Quote',
      command: 'formatBlock',
      text: '&#10077;&#10078;',
      value: 'blockquote'
    }
  };

  //
  // Shared Methods
  //

  /**
   * Check if browser supports required methods.
   * @private
   * @returns {Boolean} Returns true if all required methods are supported.
   */
  var supports = function () {
    return (
      'querySelector' in document &&
      'addEventListener' in window &&
      'classList' in document.createElement('div') &&
      'contentEditable' in document.createElement('div') &&
      'insertAdjacentElement' in document.createElement('div')
    );
  };

  /**
   * Check `obj` is a HTMLElement.
   * @private
   * @param {Object} obj The obj to check.
   * @returns {Boolean} Returns `true` if `obj` is a HTMLElement, else `false`.
   */
  var isElement = function (obj) {
    return obj instanceof HTMLElement;
  };

  /**
   * Merge two or more objects. Returns a new object.
   * @private
   * @param {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
   * @param {Object}   objects  The objects to merge together
   * @returns {Object}          Merged values of defaults and options
   */
  var extend = function () {

    // Variables
    var extended = {};
    var deep = false;
    var i = 0;
    var length = arguments.length;

    // Check if a deep merge
    if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
      deep = arguments[0];
      i++;
    }

    // Merge the object into the extended object
    var merge = function (obj) {
      for (var prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
          // If deep merge and property is an object, merge properties
          if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
            extended[prop] = extend(true, extended[prop], obj[prop]);
          } else {
            extended[prop] = obj[prop];
          }
        }
      }
    };

    // Loop through each object and conduct a merge
    for (; i < length; i++) {
      var obj = arguments[i];
      merge(obj);
    }

    return extended;

  };

  //
  // Plugin Constructor
  //

  /** 
   * Plugin Object
   * @constructor
   * @param {Object} options User settings
   */
  var Plugin = function (options) {

    //
    // Plugin Variables
    //

    var publicAPIs = {};
    var settings = null;
    var editorToolbar = null;
    var editorContent = null;
    var editorFooter = null;

    //
    // Plugin Methods
    //

    /**
     * Initialize Plugin.
     * @public
     * @param {Object} options User settings
     */
    publicAPIs.init = function (options) {

      // Feature test
      if (!supports()) throw 'ysEditor: This browser does not support the required JavaScript methods and browser APIs.';

      // Destroy any existing initializations
      publicAPIs.destroy();

      // Merge settings into defaults
      settings = extend(defaults, options || {});

      // Select wrapper
      settings.wrapper = (typeof settings.wrapper === 'string') ? document.querySelector(settings.wrapper) : settings.wrapper;

      // Check if a valid element
      if (!isElement(settings.wrapper)) throw new TypeError('ysEditor: Please select a valid wrapper.');

      // Check if plugin is already installed
      if (Plugin.cache.indexOf(settings.wrapper) !== -1) return;

      // Add style to wrapper
      settings.wrapper.classList.add('yseditor');

      // Create editor toolbar area
      editorToolbar = new Toolbar('yseditor-toolbar');
      editorToolbar.addButtonRange(settings.toolbar, predefinedButtons);

      // Create editor content area
      editorContent = new Content('div', 'yseditor-content');
      if (settings.includeContent === true) editorContent.setHTML(settings.wrapper.innerHTML);
      if (settings.scroll === true) {
        editorContent.element.style.overflowY = 'scroll';
        editorContent.element.style.height = parseInt(settings.height) + 'px';
      }
      editorContent.element.contentEditable = true;

      // Create editor content area
      editorFooter = new Footer('yseditor-footer', settings.footerText);

      // Setup editor area
      settings.wrapper.innerHTML = null;
      settings.wrapper.insertAdjacentElement('afterbegin', editorContent.render());
      settings.wrapper.insertAdjacentElement((settings.bottom) ? 'beforeend' : 'afterbegin', editorToolbar.render());
      if (settings.footer === true) settings.wrapper.insertAdjacentElement('beforeend', editorFooter.render());

      // Adds editor to already installed array
      Plugin.cache.push(settings.wrapper);

    };

    /**
     * Returns the editor text.
     * @public
     * @returns {string} editor text
     */
    publicAPIs.getText = function () {
      return editorContent.getText();
    };

    /**
     * Sets the editor text.
     * @public
     * @param {string} text editor text
     */
    publicAPIs.setText = function (text) {
      return editorContent.setText(text);
    };

    /**
     * Returns the editor html content.
     * @public
     * @returns {string} editor html content
     */
    publicAPIs.getHTML = function () {
      return editorContent.getHTML();
    };

    /**
     * Sets the editor html.
     * @public
     * @param {string} html html
     */
    publicAPIs.setHTML = function (html) {
      return editorContent.setHTML(html);
    };

    /**
     * Destroy the current initialization.
     * @public
     */
    publicAPIs.destroy = function () {

      // if plugin isn't already initialized, stop
      if (!settings) return;

      // Remove editor tools     
      settings.wrapper.innerHTML = editorContent.getHTML();
      settings.wrapper.classList.remove('yseditor');
      Plugin.cache.splice(Plugin.cache.indexOf(settings.wrapper), 1);

      // Reset variables
      settings = null;
      editorToolbar = null;
      editorContent = null;
      editorFooter = null;

    };

    //
    // Toolbar
    //

    /**
     * Toolbar Object
     * @constructor
     * @param {string} className Toolbar classname
     */
    var Toolbar = function (className) {
      this.buttons = [];
      this.element = null;
      this.className = className;
    };

    /**
     * Adds button to toolbar
     * @public
     * @param {ToolbarButton} button button
     */
    Toolbar.prototype.addButton = function (button) {
      this.buttons.push(button);
    };

    /**
     * Render the toolbar
     * @public
     * @returns {HTMLElement} rendered element
     */
    Toolbar.prototype.render = function () {
      this.element = document.createElement('div');
      this.element.className = this.className;

      for (var i = 0, buttonCount = this.buttons.length; i < buttonCount; i++) {
        var currentButton = this.buttons[i];
        this.element.appendChild(currentButton.render());
      }

      return this.element;
    };

    /**
     * Adds the buttons indicated by `buttonList` to the toolbar
     * @public
     * @param {Array} buttonList button list
     * @param {Object} buttonOptions button options
     */
    Toolbar.prototype.addButtonRange = function (buttonList, buttonOptions) {

      for (var i = 0, buttonCount = buttonList.length; i < buttonCount; i++) {
        var currentButton = buttonList[i];

        if (!buttonOptions.hasOwnProperty(currentButton)) {
          console.log('ysEditor: ' + currentButton + ' not found');
          continue;
        }

        var currentOptions = buttonOptions[currentButton];

        if (typeof currentOptions === 'object') {
          this.addButton(new ToolbarButton(currentOptions.command, currentOptions.text, currentOptions.title, currentOptions.value, currentOptions.callback));
        }

      }
    };

    //
    // Toolbar Button
    //

    /**
     * ToolbarButton Object
     * @constructor
     * @param {string} command command
     * @param {string} text button text
     * @param {string} title button title
     * @param {string} value command value
     * @param {function} callback button callback function
     */
    var ToolbarButton = function (command, text, title, value, callback) {
      this.command = command;
      this.text = text || '';
      this.title = title || '';
      this.value = value;
      this.callback = callback;
      this.element = null;
    };

    /**
     * Render the toolbar
     * @public
     * @returns {HTMLElement} rendered element
     */
    ToolbarButton.prototype.render = function () {
      var self = this;
      this.element = document.createElement('button');
      this.element.innerHTML = this.text;
      this.element.title = this.title;
      this.element.type = 'button';
      this.element.addEventListener('click', function () {
        if (document.queryCommandSupported(self.command) && document.execCommand(self.command, false, self.value || '')) {
          editorContent.element.focus();
        }
      });

      if (typeof this.callback === 'function') this.callback(this, editorContent);

      return this.element;
    };

    //
    // Content
    //

    /**
     * Content Object
     * @constructor
     * @param {string} elementType content element type
     * @param {string} className Content classname
     */
    var Content = function (elementType, className) {
      this.elementType = elementType;
      this.className = className;
      this.element = document.createElement(this.elementType);
    };

    /**
     * Render the content
     * @public
     * @returns {HTMLElement} rendered element
     */
    Content.prototype.render = function () {
      this.element.className = this.className;
      return this.element;
    };

    /**
    * Sets the editor html
    * @public
    * @param {string} html html
    */
    Content.prototype.setHTML = function (html) {
      this.element.innerHTML = html || '';
    };

    /**
    * Returns the editor html content
    * @public
    * @returns {string} editor html content
    */
    Content.prototype.getHTML = function () {
      return this.element.innerHTML;
    };

    /**
    * Sets the editor text
    * @public
    * @param {string} text editor text
    */
    Content.prototype.setText = function (text) {
      this.element.textContent = text;
    };

    /**
    * Returns the editor text.
    * @public
    * @returns {String} editor text
    */
    Content.prototype.getText = function () {
      return this.element.textContent.replace(/\s{2,}/g, ' ');
    };

    //
    // Footer
    //

    /**
     * Footer Object
     * @constructor
     * @param {string} className Footer classname
     * @param {string} text footer text
     */
    var Footer = function (className, text) {
      this.element = null;
      this.className = className;
      this.text = text
    };

    /**
    * Render the footer
    * @public
    * @returns {HTMLElement} rendered element
    */
    Footer.prototype.render = function () {
      this.element = document.createElement('div');
      this.element.className = this.className;
      this.element.innerHTML = this.text;
      return this.element;
    };

    //
    // Initialize plugin
    //

    publicAPIs.init(options);

    //
    // Return the public APIs
    //

    return publicAPIs;

  };

  /**
   * Defines a button to be used in the toolbar.
   * @static
   * @param {string} name button name
   * @param {object} options button options
   */
  Plugin.defineButton = function (name, options) {
    predefinedButtons[name] = options;
  };

  /**
   * Installed editor cache array
   * @static
   */
  Plugin.cache = [];

  //
  // Return the Plugin
  //

  return Plugin;

});
