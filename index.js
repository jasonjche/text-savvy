require('dotenv').config();
const OpenAI = require('openai');
const { Configuration, OpenAIApi } = OpenAI;

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const app = express();
const port = 3001;

const configuration = new Configuration({
    organization: "org-nG55UrIJBArh3cNhcpw0Tfrv",
    apiKey: process.env.OPENAI_SECRET_KEY,
});

const promptScorer = 'You are a rater of my text messages to a girl. Rate it on a scale of 1 to 10, and give me a reasoning as to why I got that message. Assume my goal is to become closer with this girl and potentially get in a relationship. Return your examples in a json object with keys "score" and "reason".\n\nExample:\n\nInput:\nPrevious Message: how are you\nMy Message: good, how was your day tho?\n\nOutput:\n{\n"score": "7",\n"reason": "You were too direct and potentially acting too fast. That previous message maybe wanted you to talk about yourself"\n}';
const promptResponder = 'You are a young adult female who is texting a guy that is interested in you. You are not interested in him and want to end the conversation. However, you try to be polite until he starts to become aggressive. Text in lower case, use slang, emojis, abbreviations, short sentences, and gramatical errors to make the conversation more realistic (only use emojis when appropriate, not on every message). The conversation ends when he stops texting you. Act like a really dry texter and make it hard for him to figure out a response because your responses are so short. When you do not know the answer, simply say idk';

const openai = new OpenAIApi(configuration)

app.use(cors());
app.use(bodyParser.json());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

app.post('/', async (req, res) => {
    const { message } = req.body;

    // If there's no conversation history for the session, initialize it
    if (!req.session.messages) {
        req.session.messages = [
            { role: "system", content: promptScorer },
            { role: "user", content: message },
        ];
    } else {
        // Append the new user message to the history
        req.session.messages.push({ role: "user", content: message });
    }

    const responseScore = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: req.session.messages,
        max_tokens: 100,
    });

    const scoreJSON = responseScore.data.choices[0].message.content;
    try {
        const jsonObject = JSON.parse(scoreJSON);
        if (jsonObject.score > 4) {
            req.session.messages[0] = { role: "system", content: promptResponder };
            const response = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: req.session.messages,
                max_tokens: 100,
            });

            if (response.data.choices[0].message.content) {
                // Append the new bot message to the history
                req.session.messages.push({ role: "assistant", content: response.data.choices[0].message.content });

                res.json({
                    message: response.data.choices[0].message.content,
                    jsonObject: jsonObject // The jsonObject to send back to the client
                });
            }
        }
    } catch (e) {
        console.log(scoreJSON);
        console.log("Error: " + e);
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
