import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Sketch from "react-p5";

const DrawBox = (props) => {

  let select_cursor, shape_cursor, freedraw_cursor, grabO_cursor, grabC_cursor;
  let cursors, active_cursor_idx;
  const preload = (p5) => {
    select_cursor = p5.loadImage('assets/select_cursor.png')
    freedraw_cursor = p5.loadImage('assets/freedraw_cursor.png')
    shape_cursor = p5.loadImage('assets/shape_cursor.png')
    grabO_cursor = p5.loadImage('assets/grabO_cursor.png')
    grabC_cursor = p5.loadImage('assets/grabC_cursor.png')
  }

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(props.editorWidth, props.editorHeight).parent(canvasParentRef);
    active_cursor_idx = 0
    cursors = {
      0 : [grabO_cursor, grabC_cursor],
      1 : select_cursor,
      2 : shape_cursor, 
      3 : freedraw_cursor,     
    }
  };

  const draw = (p5) => {
    p5.background(245);
    manageCursor(p5)
  };

  const manageCursor = (p5) => {
    let curs = cursors[active_cursor_idx]
    let offset = active_cursor_idx == 0 || active_cursor_idx == 2 ? 12 : 0
    if (active_cursor_idx == 0) curs = curs[0]
    p5.image(curs, p5.mouseX - offset, p5.mouseY - offset, 24, 24)
  }

  return (
    <Sketch setup={setup} draw={draw} preload={preload} />
  )
};

export default DrawBox;