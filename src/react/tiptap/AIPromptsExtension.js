import xmlFormat from 'xml-formatter';
const url = 'http://localhost:8080/ai';

const getContext = (HTMLWithCursors) => {
    
    let context = HTMLWithCursors;

    // console.log('selectionHTML', selectionHTML)

    // make sure context is under 12000 characters
    if (context.length > 12000) {
        // if it is, limit the text to 12000 characters, and make sure the cursor is inside the context
        const cursorIndex = context.indexOf('<cursor-start/>');
        const cursorEndIndex = context.indexOf('<cursor-end/>');
        const contextStart = context.substring(0, cursorIndex);
        const contextEnd = context.substring(cursorEndIndex + 9);
        const contextLength = contextStart.length + contextEnd.length;
        const contextOverflow = contextLength - 12000;
        const contextStartOverflow = contextStart.length - contextOverflow;
        context = contextStart.substring(contextStartOverflow) + contextEnd;
    }

    return  context;
}


const formatHTML = (HTMLContent) => {
    // add new lines between tags, except for <strong>, <em>, <u>, <s>, <code>, <cursor-start/>, and <cursor-end/>, and <span>, even if they have attributes inside
    const regex = /(<\/?(?!strong|em|u|s|code|cursor-start|cursor-end|span)[^>]+>)/g;
    const HTMLFormatted = HTMLContent.replace(regex, '\n$1\n');

    return HTMLFormatted;
}


const replaceSelection = (HTMLWithCursors, HTMLReplaceSelection) => {
    // insert the replacement html where the user selected
    // remove whitespaces and new lines between tags
    const regex = />\s+</g;
    const HTMLReplaceSelectionClean = HTMLReplaceSelection.replace(regex, '><');

    const HTMLWithCursorsClean = HTMLWithCursors.replace(regex, '><');

    // replace the whole area between <cursor-start/> and <cursor-end/> with the replacement
    const cursorStartIndex = HTMLWithCursorsClean.indexOf('<cursor-start/>');
    const cursorEndIndex = HTMLWithCursorsClean.indexOf('<cursor-end/>');
    const replacement = HTMLReplaceSelectionClean.substring(0, HTMLReplaceSelectionClean.length - 1);
    const replacementWithoutWhitespace = replacement.replace(regex, '><');
    const newHTML = HTMLWithCursorsClean.substring(0, cursorStartIndex) + replacementWithoutWhitespace + HTMLWithCursorsClean.substring(cursorEndIndex + 12);

    return newHTML;
}


// export const callAIPromptWithQuestion = async (editor, promptTitle, userPrompt, errorCallback, loadingCallback, selection, saveContentCallback) => {
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

export const callAIPromptWithQuestion = async (editor, promptTitle, userPrompt, errorCallback, loadingCallback, selection, saveContentCallback) => {}

export const callAIPrompt = async (editor, promptTitle, errorCallback, loadingCallback, saveContentCallback) => {
    let question;

    console.log("Calling AI Prompt:" + promptTitle);

    // if the editor is not in focus, throw an erro
    if( !editor.isActive() ){
        return errorCallback('The editor is not in focus.');
    }

    if(promptTitle !== 'Beautify' && promptTitle !== 'FillBlanks'){
        return errorCallback('Invalid prompt title.');
    }

    let selection = [editor.state.selection.from, editor.state.selection.to];

    if ( selection[0] === selection[1] ){
        return errorCallback('The selection is empty.');
    }

    loadingCallback(true);

    const HTMLWithCursors = await getHTMLWithCursors(editor, selection, saveContentCallback);

    console.log('HTMLWithCursors:\n', HTMLWithCursors)

    let context;

    try {
        context = getContext(HTMLWithCursors);
    } catch (error) {
        loadingCallback(false);
        return errorCallback(error.message);
    }

    console.log('context:\n', context);

    question = formatHTML(context);

    console.log('question:\n', question);

    const data = {
        "question": question,
    };

    const HTMLReplaceSelection = await fetch(url + '/' + promptTitle, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    }).then(response => response.json()).then(data => {
        const answer = data.message.content;
        return answer;
    }).catch(error => {
        console.error('Error:', error);
        loadingCallback(false);
        errorCallback(error.message);
        return undefined
    });

    if (!HTMLReplaceSelection) {
        return;
    }

    console.log('HTMLReplaceSelection:\n', HTMLReplaceSelection);

    const newHTML = replaceSelection(HTMLWithCursors, HTMLReplaceSelection);

    console.log('newHTML:\n', newHTML);

    // redundant
    await editor.commands.setContent(newHTML);

    // TODO: Figure out how to set the selection to after the replaced selection
    await editor.commands.setTextSelection(selection[0], selection[0]);

    saveContentCallback(newHTML);

    loadingCallback(false);
}


// export const callAIPromptWithQuestion = async (editor, promptTitle, userPrompt, errorCallback, loadingCallback, selection, saveContentCallback) => {
//     console.log("Calling AI Prompt: " + promptTitle);
// }

export const getHTMLWithCursors = async (editor, selection, saveContentCallback) => {
    console.log('before:\n',editor.getHTML())

    const startTag = '℥♨︎☈';
    const endTag = '🀒⚒︎🃗';

    await addMarkerTags(editor);

    const HTMLContent = editor.getHTML();

    // console.log('HTMLContent1', HTMLContent);

    const HTMLWithCursors = HTMLContent.replace(startTag, '<cursor-start/>').replace(endTag, '<cursor-end/>');
    const HTMLNoCursors = HTMLContent.replace(startTag, '').replace(endTag, '');

    // console.log('HTMLContent2', HTMLWithCursors);

    await editor.commands.setContent(HTMLNoCursors);

    // set selection to what it was originally
    await editor.commands.setTextSelection(selection[0], selection[1]);

    saveContentCallback(HTMLNoCursors);

    //print editor content
    // console.log('after:\n',editor.getHTML());

    return HTMLWithCursors;
}
  
async function addMarkerTags(editor) {
    const { state, dispatch } = editor.view;
  
    // Get the start and end positions of the selection
    const { from, to } = state.selection;
  
    // Create marker tags
    const startTag = '℥♨︎☈';
    const endTag = '🀒⚒︎🃗';
  
    // Create the transaction to modify the content
    const transaction = editor.view.state.tr;
    transaction.insertText(`${startTag}`, from, from);
    transaction.insertText(`${endTag}`, to + startTag.length, to + startTag.length);

    await dispatch(transaction);
}
  
  