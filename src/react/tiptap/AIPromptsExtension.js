import xmlFormat from 'xml-formatter';
const url = 'http://localhost:8080/ai';

const getContext = (editor, selection, errorIfEmpty=false) => {
    const document = editor.getHTML();

    // if the editor is not in focus, throw an error

    if( errorIfEmpty && selection[0] === selection[1]){
        throw new Error('The selection is empty.');
    }

    // add <cursor> and </cursor> around the selection, with the selcted content in between    
    const selectionHTML = document.substring(selection[0], selection[1]);
    let context = document.substring(0, selection[0]) + '<cursor>' + selectionHTML + '</cursor>' + document.substring(selection[1]);

    console.log('selectionHTML', selectionHTML)

    // make sure context is under 12000 characters
    if (context.length > 12000) {
        // if it is, limit the text to 12000 characters, and make sure the cursor is inside the context
        const cursorIndex = context.indexOf('<cursor>');
        const cursorEndIndex = context.indexOf('</cursor>');
        const contextStart = context.substring(0, cursorIndex);
        const contextEnd = context.substring(cursorEndIndex + 9);
        const contextLength = contextStart.length + contextEnd.length;
        const contextOverflow = contextLength - 12000;
        const contextStartOverflow = contextStart.length - contextOverflow;
        context = contextStart.substring(contextStartOverflow) + contextEnd;
    }

    return  context;
}


const replaceSelection = (editor, replacement, selection) => {
    // insert the replacement html where the user selected
    // remove whitespaces and new lines between tags
    const regex = />\s+</g;
    const replacementWithoutWhitespace = replacement.replace(regex, '><');
    console.log('replacementWithoutWhitespace', replacementWithoutWhitespace);
}


// export const callAIPromptWithQuestion = async (editor, promptTitle, userPrompt, errorCallback, loadingCallback, selection) => {
//     let question;
//     console.log("Calling AI Prompt: " + promptTitle);

//     // temporarily disable the editor
//     editor.isReadOnly = true;
//     loadingCallback(true);

//     if( promptTitle === 'Prompt' ){
//         // get the context
//         let context;
//         try {
//             context = getContext(editor, selection, false);
//         } catch (error) {
//             loadingCallback(false);
//             return errorCallback(error.message);
//         }

//         if( !userPrompt || userPrompt === '' ){
//             loadingCallback(false);
//             return errorCallback('The prompt is empty.');
//         }

//         // get the question
//         question = xmlFormat(context) + '\n\n----------\n\n' + userPrompt;
//     }else{
//         loadingCallback(false);
//         return errorCallback('Invalid prompt title.');
//     }

//     console.log('question', question);

//     const data = {
//         "question": question,
//     };

//     console.log('data', data);

//     const answer = await fetch(url + '/' + promptTitle, {
//         method: 'POST',
//         headers: {
//         'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data),
//         mode: 'cors'
//     }).then(response => response.json()).then(data => {
//         const answer = data.message.content;
//         return answer;
//     }).catch(error => {
//         console.error('Error:', error);
//     });

//     console.log('answer', answer);

//     // re-enable the editor
//     editor.isReadOnly = false;
//     loadingCallback(false);

//     editor.commands.setTextSelection(editor.state.selection.from, editor.state.selection.to);

//     // replace the selection with the answer
//     replaceSelection(editor, answer, selection);
// }


// export const callAIPrompt = async (editor, promptTitle, errorCallback, loadingCallback) => {
//     let question, selection;

//     console.log("Calling AI Prompt: " + promptTitle);

//     // if the editor is not in focus, throw an error
//     // editor.isFocused is not a function
//     if (!editor.state.selection) {
//         return errorCallback('Place your cursor in the editor.');
//     }

//     selection = [editor.state.selection.from, editor.state.selection.to];

//     console.log('selection', selection)

//     // temporarily disable the editor
//     editor.isReadOnly = true;
//     loadingCallback(true);

//     if ( promptTitle === 'FillBlanks' ) {
//         // get the context
//         let context;
//         try {
//             context = getContext(editor, selection, true);
//         } catch (error) {
//             loadingCallback(false);
//             return errorCallback(error.message);
//         }

//         // get the question
//         question = context;
//     } else if ( promptTitle === 'Beautify' ) {
//         // get the context
//         let context;
//         try {
//             context = getContext(editor, selection, true);
//         } catch (error) {
//             loadingCallback(false);
//             return errorCallback(error.message);
//         }

//         // get the question
//         question = context;
//     } else {
//         loadingCallback(false);
//         return errorCallback('Invalid prompt title.');
//     }

//     console.log('question', question);

//     const data = {
//         "question": question,
//     };

//     console.log('data', data);

//     // const answer = await fetch(url + '/' + promptTitle, {
//     //     method: 'POST',
//     //     headers: {
//     //     'Content-Type': 'application/json'
//     //     },
//     //     body: JSON.stringify(data),
//     // }).then(response => response.json()).then(data => {
//     //     const answer = data.message.content;
//     //     return answer;
//     // }).catch(error => {
//     //     console.error('Error:', error);
//     // });

//     const answer = question + ' <p>answer</p>'

//     console.log('answer', answer);

//     // re-enable the editor
//     editor.isReadOnly = false;
//     loadingCallback(false);

//     editor.commands.setTextSelection(editor.state.selection.from, editor.state.selection.to);

//     // replace the selection with the answer
//     replaceSelection(editor, answer);
// }


export const callAIPromptWithQuestion = async (editor, promptTitle, userPrompt, errorCallback, loadingCallback, selection) => {
    console.log("Calling AI Prompt: " + promptTitle);
}

export const callAIPrompt = async (editor, promptTitle, errorCallback, loadingCallback) => {
    console.log("Calling AI Prompt: " + promptTitle);

    console.log('Commands:\n', editor.commands)

    
}
