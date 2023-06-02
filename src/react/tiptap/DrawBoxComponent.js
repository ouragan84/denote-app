import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';
import Sketch from "react-p5";
import {FaMousePointer,FaHandRock,} from "react-icons/fa"
import {AiOutlineLine} from "react-icons/ai"
import {MdCircle, MdSquare} from 'react-icons/md'
import {BsPencilFill} from 'react-icons/bs'

const select = 0, grab = 1, lin = 2, circle = 3, square = 4, pencil = 5


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
  
  update(p5, ax = this.px, ay = this.py, bx = this.x, by = this.y){
    p5.stroke(0)
    p5.strokeWeight(p5.constrain(p5.map(p5.dist(ax,ay,bx,by), 0, 150, 4, 1), 1.25,3.5))
    p5.line(ax,ay,bx,by)
  }
}

const DrawBox = (props) => {

  console.log(props.initialData)

  var onScreenObjects = props.initialData

  // select, grab, line, circle, square, pencil
  const [tools, settools] = useState([true, false, false, false, false, false])

  var lines = [] // array of Line objects
  var selectRect = {
    from:[],
    to:[]
  }

  const preload = (p5) => {

  }

  const mousePressed = (p5) => {
    if (tools[select]){
      selectRect.from = [p5.mouseX, p5.mouseY]
    } 
    else if (tools[grab]){
      
    } 
    else if (tools[lin]){
      
    } 
    else if (tools[circle]){
      
    } 
    else if (tools[square]){
      
    } 
    else if (tools[pencil])
    {

    }
  }

  const mouseReleased = (p5) => {
    if (tools[select]){
      selectRect.to = [p5.mouseX, p5.mouseY]
    } 
    else if (tools[grab]){
      
    } 
    else if (tools[lin]){
      
    } 
    else if (tools[circle]){
      
    } 
    else if (tools[square]){
      
    } 
    else if (tools[pencil])
    {
      onScreenObjects.push({
        type:'pencil',
        positions: lines.map(l => [l.x, l.y])
      })
      props.updateData(onScreenObjects)
      lines = []
    }
  };

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(props.editorWidth ? props.editorWidth : 900, props.editorHeight ? props.editorHeight : 600).parent(canvasParentRef);
  };

  const draw = (p5) => {
    p5.background(245);
    // console.log(onScreenObjects)
    if (tools[select]){
      if (p5.mouseIsPressed){
        p5.stroke(200)
        p5.strokeWeight(1)
        p5.fill('rgba(100,110,130, 0.1)');
        p5.rectMode(p5.CORNERS)
        p5.rect(selectRect.from[0], selectRect.from[1], p5.mouseX, p5.mouseY)
      }
    } 
    else if (tools[grab]){
      
    } 
    else if (tools[lin]){
      
    } 
    else if (tools[circle]){
      
    } 
    else if (tools[square]){
      
    } 
    else if (tools[pencil])
    {
      if (p5.mouseIsPressed){
        var line = new MyLine(p5)
        lines.push(line)
      }
      for(var line of lines){
        line.update(p5)
      }
    }


    // draw all on screen objs
    for (var elem of onScreenObjects){
      if (elem.type == 'pencil' && elem.positions){
        for (let i = 1; i < elem.positions.length; i++){
          (new MyLine(p5)).update(p5, elem.positions[i-1][0], elem.positions[i-1][1], elem.positions[i][0], elem.positions[i][1])
        }
      }
      else if (elem.type == 'select' && elem.positions){
      }
      else if (elem.type == 'grab' && elem.positions){
      }
      else if (elem.type == 'square' && elem.positions){
      }
      else if (elem.type == 'circle' && elem.positions){
      }
      else if (elem.type == 'line' && elem.positions){
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
      <Sketch setup={setup} draw={draw} preload={preload} mousePressed={mousePressed} mouseReleased={mouseReleased} />
    </div>
  )
};

export default DrawBox;