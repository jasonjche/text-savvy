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

// Define the prompts
const promptScorer = 'You are a rater of my text messages to a girl. Rate it on a scale of 1 to 10, and give me a reasoning as to why I got that message. Assume my goal is to become closer with this girl and potentially get in a relationship. Return your examples in a json object with keys "score" and "reason". Do not add any additional commentary besides the json. \n\nExample:\n\nInput:\nPrevious Message: how are you\nMy Message: good, how was your day tho?\n\nOutput:\n{\n"score": "7",\n"reason": "You were too direct and potentially acting too fast. That previous message maybe wanted you to talk about yourself"\n}';
const promptResponder = 'You are a young adult female who is texting a guy that is interested in you. You are not interested in him and want to end the conversation. However, you try to be polite until he starts to become aggressive. Text in lower case, use slang, emojis, abbreviations, short sentences, and gramatical errors to make the conversation more realistic (only use emojis when appropriate, not on every message). The conversation ends when he stops texting you. Act like a really dry texter and make it hard for him to figure out a response because your responses are so short. When you do not know the answer, simply say idk. Only respond with the next text in the sequence, assume the most recent text was from him.';
let previousMessage = '';
let messageArray = [];

// Define Express application settings
app.use(cors());
app.use(bodyParser.json());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

const initializeMessages = (message) => {
    messageArray = [
        { role: 'system', content: promptResponder },
        { role: 'user', content: message },
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

const rateMessage = async (message) => {
    const formattedMessage = `Previous Message: ${previousMessage}\nMy Message: ${message}`;
    const messages = [
        { role: 'system', content: promptScorer },
        { role: 'user', content: formattedMessage },
    ];
    return await createChatCompletion(messages);
}

app.post('/', async (req, res) => {
    const { message } = req.body;
    console.log(message);
    if (messageArray.length === 0) {
        initializeMessages(message);
    } else {
        // Append user message to the history
        appendUserMessage(message);
    }

    console.log(messageArray);

    try {
        const responseScore = await rateMessage(message);
        const scoreJSON = responseScore.data.choices[0].message.content;
        const jsonObject = JSON.parse(scoreJSON);

        if (jsonObject.score > 4) {
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

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
