import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import EditorToolbar, { modules, formats } from "./EditorToolbar";
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import 'react-quill/dist/quill.core.css';

export default ({content, setContent}) => {

  return (
    <>
      <div className="text-editor" style={{
        display: 'flex',
        flexDirection: 'column',
        top: 0,
        left: 0

      }}>
        <EditorToolbar />
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          placeholder={"Write something awesome..."}
          modules={modules}
          formats={formats}
          style={{
            height: '80vh'
          }}
        />
      </div>
    </>
  );
}
