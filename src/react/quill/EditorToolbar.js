import React, { useState } from "react";
import { Quill } from "react-quill";
import ReactDOM from 'react-dom';
import ImageResize from 'quill-image-resize-module-react';
import { ImageDrop } from 'quill-image-drop-module';
import MathTextBox from './MathBox';
import crypto from 'crypto';

Quill.register('modules/imageDrop', ImageDrop);
Quill.register('modules/imageResize', ImageResize);
const Embed = Quill.import('blots/embed');
const Inline = Quill.import('blots/inline');
const Block = Quill.import('blots/block');
const BlockEmbed = Quill.import('blots/block/embed');

class MyButtonBlot extends BlockEmbed {
    static create(value) {
        let node = super.create();
        node.style.backgroundColor = 'red';
        node.style.width = '100px';
        node.style.height = '100px';

        let button = document.createElement('button');
        button.innerHTML = 'Click me';
        button.style.width = '80px';
        button.style.height = '40px';
        button.style.backgroundColor = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.marginTop = '30px';
        button.style.marginLeft = '10px';
        button.style.boxShadow = '0 0 5px 0px rgba(0,0,0,0.75)';
        button.addEventListener('click', () => {
            console.log('Clicked');
        });

        node.appendChild(button);

        return node;
    }
  
    static formats(node) {
      // We still need to report unregistered embed formats
      let format = {};
      if (node.hasAttribute('height')) {
        format.height = node.getAttribute('height');
      }
      if (node.hasAttribute('width')) {
        format.width = node.getAttribute('width');
      }
      return format;
    }
  
    static value(node) {
      return '';
    }
  
    format(name, value) {
      // Handle unregistered embed formats
      if (name === 'height' || name === 'width') {
        if (value) {
          this.domNode.setAttribute(name, value);
        } else {
          this.domNode.removeAttribute(name, value);
        }
      } else {
        super.format(name, value);
      }
    }
}
MyButtonBlot.blotName = 'mybutton';
MyButtonBlot.tagName = 'div';

Quill.register(MyButtonBlot);

let stateRegistry = new Map();

const createState = (value) => {
    let id = crypto.randomBytes(16).toString("hex");
    stateRegistry.set(id, {
        value: value,
        setValue: (newValue) => {
            console.log(`New value for state ${id}: `, newValue);
            stateRegistry.set(id, {
                ...stateRegistry.get(id),
                value: newValue,
            });
        }
    });
    return [id, stateRegistry.get(id).setValue];
}

class MyMathBoxBlot extends BlockEmbed {
    static create(value) {
        let node = super.create();

        let [latexStateId, handleUpdate] = createState(value);

        node.setAttribute('isCustomReact', true);
        node.setAttribute('id', latexStateId);

        const container = document.createElement('div');
        ReactDOM.render(<MathTextBox initialValue={value} handleUpdate={handleUpdate} />, container);
        node.appendChild(container);

        return node;
    }
  
    static formats(node) {
      // We still need to report unregistered embed formats
      let format = {};
      if (node.hasAttribute('height')) {
        format.height = node.getAttribute('height');
      }
      if (node.hasAttribute('width')) {
        format.width = node.getAttribute('width');
      }
      return format;
    }
  
    static value(node) {
      return '';
    }
  
    format(name, value) {
      // Handle unregistered embed formats
      if (name === 'height' || name === 'width') {
        if (value) {
          this.domNode.setAttribute(name, value);
        } else {
          this.domNode.removeAttribute(name, value);
        }
      } else {
        super.format(name, value);
      }
    }
}
MyMathBoxBlot.blotName = 'mathbox';
MyMathBoxBlot.tagName = 'div';

Quill.register(MyMathBoxBlot);

  

// Custom Undo button icon component for Quill editor. You can import it directly
// from 'quill/assets/icons/undo.svg' but I found that a number of loaders do not
// handle them correctly
const CustomUndo = () => (
  <svg viewBox="0 0 18 18">
    <polygon className="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10" />
    <path
      className="ql-stroke"
      d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"
    />
  </svg>
);

// Redo button icon component for Quill editor
const CustomRedo = () => (
  <svg viewBox="0 0 18 18">
    <polygon className="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10" />
    <path
      className="ql-stroke"
      d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"
    />
  </svg>
);

const CustomCirle = () => (
    <svg viewBox="0 0 18 18">
        <circle className="ql-fill ql-stroke" cx="9" cy="9" r="8" />
    </svg>
  );


// Undo and redo functions for Custom Toolbar
function undoChange() {
  this.quill.history.undo();
}

function redoChange() {
  this.quill.history.redo();
}

function customCirle() {
    // prints the current selection, and replaces it with "Hello World"
    const range = this.quill.getSelection();
    console.log(range);
    this.quill.deleteText(range.index, range.length);
    this.quill.insertText(range.index, 'Hello, World!');
    this.quill.setSelection(range.index + 1, 0);
}

function addCustomButton(){
    // let range = this.quill.getSelection(true);
    // this.quill.insertText(range.index, '\n', Quill.sources.USER);
    // let url = 'https://www.youtube.com/embed/QHH3iSeDBLo?showinfo=0';
    // this.quill.insertEmbed(range.index + 1, 'video', url, Quill.sources.USER);
    // this.quill.setSelection(range.index + 2, Quill.sources.SILENT);

    let range = this.quill.getSelection(true);
    this.quill.insertText(range.index, '\n', Quill.sources.USER);
    this.quill.insertEmbed(range.index + 1, 'mathbox', '\\frac{x^2}{2}', Quill.sources.USER);
    this.quill.setSelection(range.index + 2, Quill.sources.SILENT);
}


// Modules object for setting up the Quill editor
export const modules = {
    toolbar: {
        container: "#toolbar",
        handlers: {
            undo: undoChange,
            redo: redoChange,
            custom_circle: customCirle,
            custom_button: addCustomButton,
        }
    },
    history: {
        delay: 500,
        maxStack: 200,
        userOnly: true
    },
    imageResize: {
        parchment: Quill.import('parchment'),
        modules: [ 'Resize', 'DisplaySize', 'Toolbar' ]
    },
    imageDrop: true
};

// Formats objects for setting up the Quill editor
export const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "align",
    "strike",
    "blockquote",
    "background",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "mathbox",
    "color",
    "code-block"
];

// Quill Toolbar component
export const QuillToolbar = () => (
    <div id="toolbar" style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#dfe4f2',
        padding: '8px',
        width: '100%',
        height: '40px',
        border: 'none',
        top: 0,
        left: 0,
        zIndex: 100,
    }}>
        <span className="ql-formats">
            <select className="ql-header" defaultValue="3">
                <option value="1">Heading</option>
                <option value="2">Subheading</option>
                <option value="3">Normal</option>
            </select>
        </span>
        <span className="ql-formats">
            <button className="ql-bold" />
            <button className="ql-italic" />
            <button className="ql-underline" />
            <button className="ql-strike" />
        </span>
        <span className="ql-formats">
            <button className="ql-list" value="ordered" />
            <button className="ql-list" value="bullet" />
            <button className="ql-indent" value="-1" />
            <button className="ql-indent" value="+1" />
        </span>
        <span className="ql-formats">
            <button className="ql-blockquote" />
        </span>
        <span className="ql-formats">
            <select className="ql-align" />
            <select className="ql-color" />
            <select className="ql-background" />
        </span>
        <span className="ql-formats">
            <button className="ql-link" />
            <button className="ql-image" />
            <button className="ql-video" />
        </span>
        <span className="ql-formats">
            <button className="ql-formula" />
            <button className="ql-code-block" />
            <button className="ql-clean" />
        </span>
        <span className="ql-formats">
            <button className="ql-undo">
                <CustomUndo />
            </button>
            <button className="ql-redo">
                <CustomRedo />
            </button>
        </span>
        <span className="ql-formats">
            <button className="ql-custom_circle">
                <CustomCirle />
            </button>
        </span>
        <span className="ql-formats">
            <button className="ql-custom_button">
                <CustomCirle />
            </button>
        </span>
    </div>
);

export default QuillToolbar;