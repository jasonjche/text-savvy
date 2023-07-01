// Load required modules
const dotenv = require('dotenv');
const OpenAI = require('openai');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');

// Initialize environment configuration
dotenv.config();

// Initialize OpenAI configuration
const { Configuration, OpenAIApi } = OpenAI;
const configuration = new Configuration({
    organization: 'org-nG55UrIJBArh3cNhcpw0Tfrv',
    apiKey: process.env.OPENAI_SECRET_KEY,
});
const openai = new OpenAIApi(configuration);

// Define constants
const port = 3001;
const app = express();

let previousMessage = '';
let promptScorer = '';
let promptResponder = '';
let messageArray = [];

// Define Express application settings
app.use(cors());
app.use(bodyParser.json());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

const initializeMessages = (promptResponder) => {
    messageArray = [
        { role: 'system', content: promptResponder },
    ];
};

const appendUserMessage = (message) => {
    messageArray.push({ role: 'user', content: message });
};


const createChatCompletion = async (messages) => {
    return await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 100,
    });
};

const rateMessage = async (promptScorer, message) => {
    const formattedMessage = `Previous Message: ${previousMessage}\nMy Message: ${message}`;
    const messages = [
        { role: 'system', content: promptScorer },
        { role: 'user', content: formattedMessage },
    ];
    const responseScore = await createChatCompletion(messages);
    const scoreJSON = responseScore.data.choices[0].message.content;
    return JSON.parse(scoreJSON);
}

app.post('/', async (req, res) => {
    const {message } = req.body;
    console.log(message);
    if (messageArray.length === 0) {
        initializeMessages(promptResponder);
    }
    appendUserMessage(message);

    console.log(messageArray);

    try {
        const jsonObject = await rateMessage(promptScorer, message);
        const score = jsonObject.score;

        if (score > 4) {
            const response = await createChatCompletion(messageArray);

            // Process and append assistant message to the history
            const responseMessage = response.data.choices[0].message.content;
            previousMessage = responseMessage
            if (responseMessage) {
                messageArray.push({ role: 'assistant', content: responseMessage });
                res.json({ message: responseMessage, jsonObject: jsonObject });
            }
        }
        else {
            res.json({ message: null, jsonObject: jsonObject });
        }
    } catch (e) {
        console.error('Error:', e);
    }
});

app.post('/changeMode', (req, res) => {
    const { promptScorer: newPromptScorer, promptResponder: newPromptResponder } = req.body;
    console.log("Mode changed")
    console.log(newPromptResponder);
    console.log(newPromptScorer);
    messageArray = [];
    promptScorer = newPromptScorer;
    promptResponder = newPromptResponder;
    res.json({ success: true });
  });

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
