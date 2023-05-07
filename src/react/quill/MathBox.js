import React, { useState } from "react";
import { addStyles, EditableMathField, StaticMathField } from "react-mathquill";

// inserts the required css to the <head> block.
// you can skip this, if you want to do that by yourself.
addStyles();

const EditableMathExample = ({initialValue, handleUpdate}) => {
    const [latex, setLatex] = useState(initialValue);

    return (
        <div>
            <EditableMathField
                latex={latex}
                onChange={(mathField) => {
                    handleUpdate(mathField.latex());
                    setLatex(mathField.latex());
                }}
            />
        </div>
    );
};

const StaticMathExample = () => {
  return <StaticMathField>{"\\frac{1}{\\sqrt{2}}\\cdot 2"}</StaticMathField>;
};

const MathTextBox = () => (
  <div>
    <h2>Editable Math Field</h2>
    <EditableMathExample style={{display: 'flex', justifyContent: 'center'}}/>
  </div>
);

export default EditableMathExample;
