
import React, { Component, Fragment } from 'react';
import Latex from 'react-latex-next'

function MathTextBox (props) {

  //const [Vs, set_Vs] = React.useState(10);

  return (
    
    <div>
        <div>
        <Latex>$V_s$</Latex> ={" "}
        {/* <input onChange={(e) => set_Vs(e.target.value)} value={Vs} /> */}
        <Latex>${props.children}$</Latex>
        </div>
    </div>
  )
}

export default MathTextBox