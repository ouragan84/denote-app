import React, { useCallback, useMemo, useState } from 'react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';

function RichTextEditor() {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState(null);

  const handleChange = useCallback((newValue) => {
    setValue(newValue);
  }, []);

  return (
    <Slate editor={editor} onChange={handleChange}>
      <Editable />
    </Slate>
  );
}

export default RichTextEditor;
