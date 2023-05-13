import React, { useState, useEffect, useRef, useCallback } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import ReactDOM from 'react-dom';


// Custom Quill module for the number box
class NumberBoxBlot extends Quill.import('blots/inline') {
    static blotName = 'numberBox';
    static tagName = 'span';
  
    static create(value) {
      const node = super.create();
      node.setAttribute('contenteditable', false);
      node.innerHTML = `<input type="number" value="${value}" />`;
      return node;
    }
  
    static value(node) {
      return node.querySelector('input').value;
    }
  }
  Quill.register(NumberBoxBlot);
  
  const QuillEditor = () => {
    const [quill, setQuill] = useState(null);
    const [number, setNumber] = useState(0);
  
    useEffect(() => {
      if (quill) {
        // Custom toolbar button to add the number box
        const CustomButton = Quill.import('ui/button');
        class NumberBoxButton extends CustomButton {
          constructor() {
            super({
              value: 'Number Box',
              class: 'number-box-button',
              eventName: 'numberBox',
              context: 'inline',
            });
          }
        }
        Quill.register(NumberBoxButton);
  
        // Initialize the editor
        const editor = new Quill(quill, {
          theme: 'snow',
          modules: {
            toolbar: {
              container: [['bold', 'italic', 'numberBox']],
              handlers: {
                numberBox: insertNumberBox,
              },
            },
          },
        });
  
        // Save the editor instance
        setQuill(editor);
  
        // Handle editor change events
        editor.on('text-change', handleTextChange);
      }
    }, [quill]);
  
    const insertNumberBox = useCallback(() => {
      const range = quill.getSelection(true);
      quill.insertText(range.index, ' ', 'numberBox', number, Quill.sources.USER);
      quill.setSelection(range.index + 1, Quill.sources.SILENT);
    }, [quill, number]);
  
    const handleTextChange = useCallback(() => {
      const delta = quill.getContents();
      const numberBoxes = delta.ops.reduce((acc, op) => {
        if (op.insert && op.attributes && op.attributes.numberBox) {
          acc.push(op.attributes.numberBox);
        }
        return acc;
      }, []);
      console.log('Number Boxes:', numberBoxes);
    }, [quill]);
  
    const handleChangeNumber = useCallback((value) => {
      setNumber(value);
    }, []);
  
    return (
      <div>
        <div ref={setQuill} />
      </div>
    );
  };
  
  export default QuillEditor;