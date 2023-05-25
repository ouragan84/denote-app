// import xmlFormat from 'xml-formatter';

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

const getSanitizedText = (text) => {
    // escape all backslashes, $ signs, and backticks
    let sanitizedText = text.replace(/\\/g, '\\\\');
    sanitizedText = sanitizedText.replace(/\$/g, '\\$');
    sanitizedText = sanitizedText.replace(/`/g, '\\`');

    return sanitizedText;
}


const getMarkdownInline = (content) => {
    let markdown = '';
    let isBold = false;
    let isItalic = false;
    let isUnderline = false;
    let isStrikethrough = false;
    let isInlineCode = false;
    let isHighlight = false;

    content.forEach(sec => {
        if( sec.type === 'text' ){
            if(sec.marks){
                if(sec.marks.find(mark => mark.type === 'bold') != isBold){
                    markdown += '**';
                    isBold = !isBold;
                }

                if(sec.marks.find(mark => mark.type === 'italic') != isItalic){
                    markdown += '*';
                    isItalic = !isItalic;
                }

                if(sec.marks.find(mark => mark.type === 'underline') != isUnderline){
                    markdown += '__';
                    isUnderline = !isUnderline;
                }

                if(sec.marks.find(mark => mark.type === 'strikethrough') != isStrikethrough){
                    markdown += '~~';
                    isStrikethrough = !isStrikethrough;
                }

                if(sec.marks.find(mark => mark.type === 'code') != isInlineCode){
                    markdown += '`';
                    isInlineCode = !isInlineCode;
                }

                if(sec.marks.find(mark => mark.type === 'highlight') != isHighlight){
                    markdown += '==';
                    isHighlight = !isHighlight;
                }

                markdown += getSanitizedText(sec.text);

            }
            
        } else if ( sec.type === 'inline-math-box' ){

            let latexCont = '$' + sec.attrs.latex + '$';
            
            if( isBold ){
                latexCont = '**' + latexCont + '**';
                isBold = false;
            }

            if( isItalic ){
                latexCont = '*' + latexCont + '*';
                isItalic = false;
            }

            if( isUnderline ){
                latexCont = '__' + latexCont + '__';
                isUnderline = false;
            }

            if( isStrikethrough ){
                latexCont = '~~' + latexCont + '~~';
                isStrikethrough = false;
            }

            if( isInlineCode ){
                latexCont = '`' + latexCont + '`';
                isInlineCode = false;
            }

            if( isHighlight ){
                latexCont = '==' + latexCont + '==';
                isHighlight = false;
            }

            markdown += latexCont;
        }
    });

    if(isBold){
        markdown += '**';
        isBold = !isBold;
    }

    if(isItalic){
        markdown += '*';
        isItalic = !isItalic;
    }

    if(isUnderline){
        markdown += '__';
        isUnderline = !isUnderline;
    }

    if(isStrikethrough){
        markdown += '~~';
        isStrikethrough = !isStrikethrough;
    }

    if(isInlineCode){
        markdown += '`';
        isInlineCode = !isInlineCode;
    }

    if(isHighlight){
        markdown += '==';
        isHighlight = !isHighlight;
    }

    return markdown;
}


const getMarkdownForBlock = (block, imageID) => {

    if( block.type === 'paragraph' ){
        return getMarkdownInline(block.content);
    }

    if( block.type === 'heading' ){
        return '#'.repeat(block.attrs.level) + ' ' + getMarkdownInline(block.content);
    }

    if( block.type === 'code-block' ){
        return '```' + block.attrs.language + '\n' + block.content[0].text + '\n```';
    }

    if( block.type === 'bulletList' ){
        const {md, newImageID} = getMarkdownForList(block.content, 'ul', imageID);
        imageID = newImageID;
        return md;
    }

    if( block.type === 'orderedList' ){
        const {md, newImageID} = getMarkdownForList(block.content, 'ol', imageID);
        imageID = newImageID;
        return md;
    }

    if( block.type === 'taskList' ){
        return '  - ' + getMarkdownInline(block.content);
    }

    if( block.type === 'blockquote' ){
        return '> ' + getMarkdownInline(block.content);
    }

    if( block.type === 'horizontal_rule' ){
        return '---';
    }

    if( block.type === 'image' ){
        return '![image_' + imageID + ']'
    }

    if( block.type === 'math-box' ){
        return '$$' + block.attrs.latex + '$$';
    }
}

// TODO
const getMarkdownForList = (blockList, type, imageID) => {
    let md = '\n';

    return {md, newImageID: imageID}
} 



const getMarkdownFromJSON = (JSONContent) => {
    console.log('JSONContent', JSONContent)


}

export const callAIPromptWithQuestion = async (editor, promptTitle, userPrompt, errorCallback, loadingCallback, selection, saveContentCallback, paymentCallback, serverURL, userID) => {

    let question;

    console.log("Calling AI Prompt:" + promptTitle);

    // if the editor is not in focus, throw an erro
    if( !editor.isActive() ){
        return errorCallback('The editor is not in focus.');
    }

    if( promptTitle !== 'Prompt' ){
        return errorCallback('Invalid prompt title.');
    }

    // we don't need to check if the selection is empty because the userPrompt will be added to the end of the document
    // if ( selection[0] === selection[1] ){
    //     return errorCallback('The selection is empty.');
    // }

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

    // console.log('context:\n', context);

    question = formatHTML(context) + '\n\n----------\n\n' + userPrompt;


    // console.log('question:\n', question);

    const data = {
        question: question,
        userID: userID,
    };

    let HTMLReplaceSelection = await fetch(serverURL + '/ai/' + promptTitle, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.json())
    .then(data => {
        return data;
    }).catch(error => {
        console.error('Error:', error);
        return {error: error.message}
    });

    if( HTMLReplaceSelection.error ){
        loadingCallback(false);
        if(HTMLReplaceSelection.error === 'user banned'){
            return paymentCallback(true);
        }else{
            return errorCallback(HTMLReplaceSelection.error);
        }
    }

    if(!HTMLReplaceSelection.message || !HTMLReplaceSelection.message.content){
        loadingCallback(false);

        fetch(serverURL + '/event', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userID: userID,
                event: 'ai_empty_response',
                additionalData: 'promptTitle: ' + promptTitle
            })
        })

        return errorCallback('Error fetching, please try again, no AI usage was deducted.');
    }

    HTMLReplaceSelection = HTMLReplaceSelection.message.content;

    console.log('HTMLReplaceSelection:\n', HTMLReplaceSelection);

    const newHTML = replaceSelection(HTMLWithCursors, HTMLReplaceSelection);

    // console.log('newHTML:\n', newHTML);

    // redundant
    await editor.commands.setContent(newHTML);

    // TODO: Figure out how to set the selection to after the replaced selection
    await editor.commands.setTextSelection(selection[0], selection[0]);

    saveContentCallback(newHTML);

    loadingCallback(false);
}


export const callAIPrompt = async (editor, promptTitle, errorCallback, loadingCallback, saveContentCallback, paymentCallback, serverURL, userID) => {
    let question;

    let mdContent = getMarkdownFromJSON(editor.getJSON());

    return;

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
        // return errorCallback('The selection is empty.');

        // set selection to entire document
        console.log(editor.state)
        // await editor.commands.setTextSelection(0, editor.state.doc.content.size);
        await editor.commands.selectAll();

        selection = [editor.state.selection.from, editor.state.selection.to];
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

    // console.log('context:\n', context);

    question = formatHTML(context);

    // console.log('question:\n', question);

    const data = {
        question: question,
        userID: userID,
    };

    let HTMLReplaceSelection = await fetch(serverURL + '/ai/' + promptTitle, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.json())
    .then(data => {
        return data;
    }).catch(error => {
        console.error('Error:', error);
        return {error: error.message}
    });

    if( HTMLReplaceSelection.error ){
        loadingCallback(false);
        if(HTMLReplaceSelection.error === 'user banned'){
            return paymentCallback(true);
        }else{
            return errorCallback(HTMLReplaceSelection.error);
        }
    }

    if(!HTMLReplaceSelection.message || !HTMLReplaceSelection.message.content){
        loadingCallback(false);

        fetch(serverURL + '/event', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userID: userID,
                event: 'ai_empty_response',
                additionalData: 'promptTitle: ' + promptTitle
            })
        })

        return errorCallback('Error fetching, please try again, no AI usage was deducted.');
    }

    HTMLReplaceSelection = HTMLReplaceSelection.message.content;
    
    console.log('HTMLReplaceSelection:\n', HTMLReplaceSelection);

    const newHTML = replaceSelection(HTMLWithCursors, HTMLReplaceSelection);

    // console.log('newHTML:\n', newHTML);

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
