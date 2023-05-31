import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';
import Sketch from "react-p5";
import {FaMousePointer,FaHandRock,} from "react-icons/fa"
import {AiOutlineLine} from "react-icons/ai"
import {MdCircle, MdSquare} from 'react-icons/md'
import {BsPencilFill} from 'react-icons/bs'

const select = 0, grab = 1, line = 2, circle = 3, square = 4, pencil = 5

const MCButton = (props) => {
  let selected = props.selected
  let setSelected = props.setSelected

  const normalStyle={width:'40px', height:'40px', backgroundColor:'whitesmoke', display:'flex', justifyContent:'center', alignItems:'center', borderRadius:12, color:'gray'}

  const selectedStyle={width:'40px', height:'40px', backgroundColor:'white', border: '1px solid #dfeaf7',display:'flex', justifyContent:'center', alignItems:'center', borderRadius:12, color:'black'}
  
  return (
    <div style={selected ? selectedStyle : normalStyle}
      onClick={()=>{
        setSelected()
      }}
    >
      {props.comp}
    </div>
  )
}

class MyLine{
  constructor(p5) {
    this.px = p5.pmouseX
    this.py = p5.pmouseY
    this.x = p5.mouseX
    this.y = p5.mouseY
  }
  
  update(p5){
    p5.stroke(0)
    p5.strokeWeight(2)
    p5.line(this.px, this.py, this.x, this.y)
  }
}

const DrawBox = (props) => {

  // select, grab, line, circle, square, pencil
  const [tools, settools] = useState([true, false, false, false, false, false])

  var lines = []
  const preload = (p5) => {

  }

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(props.editorWidth, props.editorHeight).parent(canvasParentRef);
  };

  const draw = (p5) => {
    p5.background(245);
    if (tools[pencil])
    {
      if (p5.mouseIsPressed){
        var line = new MyLine(p5)
        lines.push(line)
      }
  
      for(var line of lines){
        line.update(p5)
      }
    }
  };

  return (
    <div style={{position: 'relative'}}>    
      <div style={{ display:'flex', flexDirection:'row', justifyContent:'space-around', alignItems:'center',position:'absolute',backgroundColor:'white', boxShadow:'0px 0px 5px lightgray', height:'50px', width:'300px', top:10, left:10, borderRadius:15}}>
        <MCButton comp={<FaMousePointer/>} selected={tools[0]} setSelected={()=>{settools([true,false,false,false,false,false])}}/>
        <MCButton comp={<FaHandRock/>} selected={tools[1]} setSelected={()=>{settools([false,true,false,false,false,false])}}/>
        <MCButton comp={<AiOutlineLine/>} selected={tools[2]} setSelected={()=>{settools([false,false,true,false,false,false])}}/>
        <MCButton comp={<MdCircle/>} selected={tools[3]} setSelected={()=>{settools([false,false,false,true,false,false])}}/>
        <MCButton comp={<MdSquare/>} selected={tools[4]} setSelected={()=>{settools([false,false,false,false,true,false])}}/>
        <MCButton comp={<BsPencilFill/>} selected={tools[5]} setSelected={()=>{settools([false,false,false,false,false,true])}}/>

      </div>
      <Sketch setup={setup} draw={draw} preload={preload} />
    </div>
  )
};

export default DrawBox;