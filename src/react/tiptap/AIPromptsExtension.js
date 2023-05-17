import xmlFormat from 'xml-formatter';
const url = 'http://localhost:8080/ai';

const getContext = (editor, errorIfEmpty=false) => {
    const document = editor.getHTML();

    // if the editor is not in focus, throw an error
    if (!editor.isFocused) {
        throw new Error('Place your cursor in the editor.');
    }

    let selection = editor.getHTML(editor.state.selection.from, editor.state.selection.to);

    if( errorIfEmpty && selection.length === 0 ){
        throw new Error('The selection is empty.');
    }

    // add <cursor> and </cursor> around the selection, with the selcted content in between
    let context = document.replace(selection, '<cursor>' + selection + '</cursor>');

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

    return [context, selection]
}


const replaceSelection = (editor, replacement) => {
    // insert the replacement html where the user selected
    editor.commands.insertContent(replacement);
}


export const callAIPrompt = async (editor, promptTitle, getModalPrompt, errorCallback, loadingCallback) => {
    let question, selection;

    console.log("Calling AI Prompt: " + promptTitle);

    // make sure the editor is focused
    if (!editor.isFocused) {
        return;
    }

    // temporarily disable the editor
    editor.isReadOnly = true;
    loadingCallback(true);

    if( promptTitle === 'Prompt' ){
        // get the context
        let context;
        try {
            [context, selection] = getContext(editor);
        } catch (error) {
            loadingCallback(false);
            return errorCallback(error.message);
        }

        const userPrompt = await getModalPrompt(context);

        // get the question
        question = xmlFormat(context) + '\n\n----------\n\n' + userPrompt;
    } else if ( promptTitle === 'FillBlanks' ) {
        // get the context
        let context;
        try {
            [context, selection] = getContext(editor, true);
        } catch (error) {
            loadingCallback(false);
            return errorCallback(error.message);
        }

        // get the question
        question = xmlFormat(context);
    } else if ( promptTitle === 'Beautify' ) {
        // get the context
        let context;
        try {
            [context, selection] = getContext(editor, true);
        } catch (error) {
            loadingCallback(false);
            return errorCallback(error.message);
        }

        // get the question
        question = xmlFormat(context);
    } else {
        loadingCallback(false);
        return errorCallback('Invalid prompt title.');
    }

    const data = {
        "question": question,
    };

    console.log('data', data);

    const answer = await fetch(url + '/' + promptTitle, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        mode: 'cors'
    }).then(response => response.json()).then(data => {
        const answer = data.message.content;
        return answer;
    }).catch(error => {
        console.error('Error:', error);
    });

    console.log('answer', xmlFormat(answer));

    // replace the selection with the answer
    replaceSelection(editor, answer);

    // re-enable the editor
    editor.isReadOnly = false;
    loadingCallback(false);
}
