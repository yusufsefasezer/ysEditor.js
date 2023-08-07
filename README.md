# ysEditor.js
A simple, small and extensible WYSIWYG web editor that does not need any plugin.

**ysEditor.js** is an lightweight javascript library that revolutionizes the concept of web editing. This remarkable WYSIWYG web editor stands out from the competition as it requires no additional plugin or library to function seamlessly.

One of the key advantages of ysEditor.js is its unparalleled simplicity. With a user-friendly interface, this editor allows you to effortlessly create and manipulate HTML markup. Whether you are an experienced programmer or a novice, ysEditor.js empowers you to edit web content in a hassle-free manner.

An exceptional feature of ysEditor.js is its extensibility. Unlike other editors that limit your options for customization, ysEditor.js provides developers with the freedom to create custom buttons tailored to their specific needs. This makes ysEditor.js an incredible tool for those seeking complete control over their editing experience.

Furthermore, ysEditor.js places a strong emphasis on customization. With this library, you have the ability to personalize every aspect of the editor, from its overall appearance to the individual buttons at your disposal. This ensures that your editor aligns perfectly with the aesthetics of your website, allowing you to deliver a seamless and cohesive user experience to your audience.

As a **javascript wysiwyg editor**, ysEditor.js stands tall amongst its peers. Its ability to accurately display the edited content in real-time, mimicking the final appearance of the webpage, makes it an indispensable tool for developers and content creators alike. Gone are the days of tediously switching between editing and preview modes – with ysEditor.js, you can immerse yourself in a truly visual editing experience.

Unlike other solutions that rely on javascript editor plugins or libraries, ysEditor.js boasts exceptional efficiency and performance. By eliminating the need for additional plugins or libraries, this editor ensures lightning-fast loading times and supports seamless integration with any project. With ysEditor.js, you can say goodbye to compatibility issues and enjoy a smooth editing experience.

The **rich text editing** capabilities of ysEditor.js are unparalleled. Whether you need to modify fonts, style text, insert media, or create tables, this library provides you with a comprehensive set of tools to accomplish your editing goals. Its interface empowers both experienced developers and casual users to effortlessly transform their ideas into stunning web content.


## [Download](https://github.com/yusufsefasezer/ysEditor.js/archive/master.zip) / [Demo](https://www.yusufsezer.com/projects/yseditor-js/) / [yusufsezer.com](https://www.yusufsezer.com)

## Why should I use ysEditor.js
* No need any plugin - does not need any plugin or library.
* Easy to use - Create the HTML markup and start using it.
* Extensible - You can create custom button.
* Customizable - Customize editor element, editor button and other options.

## How to use

Compiled and production-ready code can be found in the `dist` directory. The `src` directory contains development code.

### 1. Include ysEditor on your site

```html
<script src="path/to/yseditor.js"></script>
<link rel="stylesheet" href="path/to/yseditor.css" />
```

### 2. Create HTML markup

ysEditor uses the `<div id="yseditor"></div>` element by default.

```html
<div id="yseditor"></div>
```
### 3. Initialize ysEditor
In the footer of your page, after the content, initialize ysEditor.

```javascript
var myEditor = new ysEditor();
```

You can also look at the [examples](examples) directory for more

## ES6 Modules

ysEditor does not have a default export, but does support CommonJS and can be used with native ES6 module imports.

```javascript
import('path/to/yseditor.js')
  .then(function () {
    var myEditor = new ysEditor();
  });
``` 

It uses a UMD pattern, and should also work in most major module bundlers and package managers.

## Working with the Source Files

If you would prefer, you can work with the development code in the `src` directory using the included [Gulp build system](https://gulpjs.com/). This compiles and minifies code.

### Dependencies
Make sure these are installed first.

* [Node.js](https://nodejs.org)
* [Gulp](https://gulpjs.com) `sudo npm install -g gulp`

### Quick Start

1. In bash/terminal/command line, `cd` into your project directory.
2. Run `npm install` to install required files.
3. When it's done installing, run one of the task runners to get going:
	* `gulp` manually compiles files.
	* `gulp watch` automatically compiles files.

## Options and Settings

ysEditor includes smart defaults and works right out of the box. But if you want to customize things, it also has a robust API that provides multiple ways for you to adjust the default options and settings.

### Global Settings

You can pass options and callbacks into ysEditor through the `init()` function:

```javascript
var myEditor = new ysEditor({
  wrapper: "#yseditor", // Editor wrapper

  // Toolbar options
  toolbar: [
    "undo", "redo", "bold", "italic", "underline",
    "strikethrough", "h1", "h2", "h3", "p", "quote",
    "left", "center", "right", "justify",
    "ol", "ul", "sub", "sup",
    "removeformat"],
  bottom: false,

  // Content options
  height: 200,
  scroll: false,
  includeContent: true,

  // Footer options
  footer: true,
  footerText: "Created by Yusuf Sezer"
});
```

#### defineButton()
Defines a button to be used in the toolbar.

```javascript
ysEditor.defineButton("name", {
	command: "",
	text: "",
	title: "",
	value: "",
	callback: function(button, editor){}
});
```

- **name** : Button name to be used in the toolbar options.
- **text** : Text that will appear in the toolbar.
- **title** (*optional*): Title that will appear when mouse over the defined button.
- **command** (*optional*): Command to be executed when the button is clicked. [*Command list*](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand)
- **value** (*optional*): The value required for some commands. [*Command list*](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand)
- **callback** (*optional*): Callback function will work when the button is added to the toolbar.

**Example 1**

```javascript
ysEditor.defineButton("indent", {
  command: "indent",
  text: "Indent",
  title: "Indent button title"
});
```

**Example 2**

```javascript
ysEditor.defineButton("h6", {
  command: "formatBlock",
  text: "H6",
  title: "Heading 6",
  value: "h6"
});
```

**Example 3**

```javascript
ysEditor.defineButton("wordcount", {
  text: 'Words:',
  callback: function (button, editor) {
    var self = this;
    button.element.textContent = self.text + ' ' + editor.getText().split(' ').length;
    editor.element.addEventListener('keyup', function () {
      button.element.textContent = self.text + ' ' + editor.getText().split(' ').length;
    });
  }
});
```
**Example 4**

```javascript
ysEditor.defineButton("bold", {
  command: "bold",
  title: "Bold", // Changed predefined title
  text: "Bold" // Changed predefined text
});
```

### Use ysEditor events in your own scripts

You can also call ysEditor events in your own scripts.

#### init()
Initialize ysEditor. This is called automatically when you setup your `new ysEditor` object, but can be used to reinitialize your instance.

```javascript
var myEditor = new ysEditor();

myEditor.init({
  height: 300,
  scroll: true,
  footer: false
});
```

#### getText()
Returns the editor text.

```javascript
var myEditor = new ysEditor();

var editorText = myEditor.getText();
```

#### setText()
Sets the editor text.

```javascript
var myEditor = new ysEditor();

myEditor.setText("My name is Yusuf SEZER");
```

#### getHTML()
Returns the editor html content.

```javascript
var myEditor = new ysEditor();

var editorHTML = myEditor.getHTML();
```

#### setHTML()
Sets the editor html.

```javascript
var myEditor = new ysEditor();

myEditor.setHTML("My name is <b>Yusuf Sezer</b>");
```

#### destroy()
Destroy the current `ysEditor.init()`. This is called automatically during the `init` function to remove any existing initializations.

```javascript
var myEditor = new ysEditor();

myEditor.destroy();
```

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details

Created by [Yusuf Sezer](https://www.yusufsezer.com)
