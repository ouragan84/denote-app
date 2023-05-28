// TODO: Add a function that checks if the selection is empty, and if it is, then it selects up to 5000 characters around where the cursor
// TODO: Add a function before calling anything that limits the cursor selection length to about 5000 characters, so it would actually change the selection to that length
// TODO: Add a function that replaces the selection chosen by the previous functions with the output of the AI, and converts it to HTML

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

const convertToMarkdown = async (editor) => {

    editor.commands.save();

    await addMarkerTags(editor);

    let htmlContent = editor.getHTML();

    console.log('htmlContent', htmlContent)

    // replace all empty paragraphs and headings with <br>
    htmlContent = htmlContent.replace(/<p>\s*<\/p>/g, '<p>_</p>');
    htmlContent = htmlContent.replace(/<h1>\s*<\/h1>/g, '<h1>_</h1>');
    htmlContent = htmlContent.replace(/<h2>\s*<\/h2>/g, '<h2>_</h2>');
    htmlContent = htmlContent.replace(/<h3>\s*<\/h3>/g, '<h3>_</h3>');

    // replace editor's conetnt with the html content
    await editor.commands.setContent(htmlContent);
    
    console.log('htmlContent', editor.getHTML())

    let MarkdownContent = editor.storage.markdown.getMarkdown();

    // look for all the <my-image base64="..." width="num"></my-image> tags, and replace them with ![image_0], ![image_1], etc. with each number corresponding to the order of the image in the document 
    // also save the base64 strings and width to an array so that they can be replaced with the actual images when the document is loaded
    let imageArray = [];
    let imageID = 0;

    htmlContent = htmlContent.replace(/<p>_<\/p>/g, '<p></p>');
    htmlContent = htmlContent.replace(/<h1>_<\/h1>/g, '<h1></h1>');
    htmlContent = htmlContent.replace(/<h2>_<\/h2>/g, '<h2></h2>');
    htmlContent = htmlContent.replace(/<h3>_<\/h3>/g, '<h3></h3>');

    htmlContent = htmlContent.replace(/℥♨︎☈/g, '');
    htmlContent = htmlContent.replace(/🀒⚒︎🃗/g, '');

    editor.commands.setContent(htmlContent);

    MarkdownContent = MarkdownContent.replace(/\[\.\.\.+\]/g, '[...]');

    MarkdownContent = MarkdownContent.replace(/℥♨︎☈/g, '<cursor-start/>');
    MarkdownContent = MarkdownContent.replace(/🀒⚒︎🃗/g, '<cursor-end/>');

    
    // make sure to recvoer the base64 strings and width of the images and store it in imageArray
    MarkdownContent = MarkdownContent.replace(/<my-image\s+base64="(.*)"\s+width="(.*)">\s*<\/my-image>/g, (match, base64, width) => {
        imageArray.push({base64, width});
        return '![image_' + (imageID++) + ']';
    });
    
    // This is a hack, but it works lmao
    MarkdownContent = MarkdownContent.replace(/<span\s+data-type="inline-math-box"\s+latex="(.*)"\s+isnew=".*">\s*<\/span>/g, (match, latex) => {
        return '$$' + latex + '$$';
    });


    return {MarkdownContent, imageArray};
}

const convertBackToHTML = async (editor, MarkdownContent, imageArray) => {
    // replace all the ![image_0], ![image_1], etc. with the actual images
    MarkdownContent = MarkdownContent.replace(/\!\[image_(\d+)\]/g, (match, p1) => {
        return '<my-image base64="' + imageArray[p1].base64 + '" width="' + imageArray[p1].width + '"></my-image>';
    });
    
    // This is a hack, but it works lmao
    MarkdownContent = MarkdownContent.replace(/\$\$(.*)\$\$/g, (match, p1) => {
        return '<span data-type="inline-math-box" latex="' + p1 + '" isnew="false"></span>';
    });
    
    // apply the markdown to the editor
    await editor.commands.setContent(MarkdownContent);

    let htmlContent = editor.getHTML();

    htmlContent = htmlContent.replace(/<p>_<\/p>/g, '<p></p>');
    htmlContent = htmlContent.replace(/<h1>_<\/h1>/g, '<h1></h1>');
    htmlContent = htmlContent.replace(/<h2>_<\/h2>/g, '<h2></h2>');
    htmlContent = htmlContent.replace(/<h3>_<\/h3>/g, '<h3></h3>');

    editor.commands.setContent(htmlContent);

    editor.commands.save();
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

    let {MarkdownContent, imageArray} = await convertToMarkdown(editor);

    console.log('MarkdownContent Before:\n\n' + MarkdownContent);

    // wait 3 s
    await new Promise(resolve => setTimeout(resolve, 2000));

    convertBackToHTML(editor, MarkdownContent, imageArray);


    // console.log("Calling AI Prompt:\n" + editor.storage.markdown.getMarkdown());

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
  

