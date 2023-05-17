import xmlFormat from 'xml-formatter';
const url = 'http://localhost:8080/ai';

export const callAIPrompt = async (editor, promptTitle) => {

    let context, question;

    console.log("Calling AI Prompt: " + promptTitle);

    // make sure the editor is focused
    if (!editor.isFocused) {
        return;
    }

    // temporarily disable the editor
    editor.isReadOnly = true;


    // TODO: Depending on question type, get the context and question

    context = editor.getHTML();
    question = "What is the meaning of life?";


    const data = {
        "question": question,
        "context": xmlFormat(context)
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


    // depending on the question type, insert the answer into the editor
    editor.commands.insertContent(answer);


    // re-enable the editor
    editor.isReadOnly = false;
}
