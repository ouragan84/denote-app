// component that is just a canvas that with a red circle drawn on it
// this is just to test that the canvas is working

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

const CanvasTest = (props) => {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(50, 50, 50, 0, 2 * Math.PI);
    ctx.fill();
  }, []);

  return (
    <canvas ref={canvasRef} {...props} />
  );
}

import Sketch from "react-p5";


let x = 50;
let y = 50;

const DrawBox = (props) => {
  const setup = (p5, canvasParentRef) => {
    // use parent to render the canvas in this ref
    // (without that p5 will render the canvas outside of your component)
    p5.createCanvas(500, 500).parent(canvasParentRef);
  };

  const draw = (p5) => {
    p5.background(0);
    p5.ellipse(x, y, 70, 70);
    // NOTE: Do not use setState in the draw function or in functions that are executed
    // in the draw function...
    // please use normal variables or class properties for these purposes
    x++;
  };

  return (
    <Sketch setup={setup} draw={draw} />
  )
};

// for some reason the canvas inside this component is not visible when rendered inside the tiptap editor's 

export default DrawBox;