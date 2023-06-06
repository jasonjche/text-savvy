    require('dotenv').config();
    const OpenAI = require('openai');
    const { Configuration, OpenAIApi } = OpenAI;

    const express = require('express');
    const bodyParser = require('body-parser');
    const cors = require('cors');
    const app = express();
    const port = 3001;

    const configuration = new Configuration({
        organization: "org-nG55UrIJBArh3cNhcpw0Tfrv",
        apiKey: process.env.OPENAI_SECRET_KEY,
    });

    const openai = new OpenAIApi(configuration)

    app.use(cors());
    app.use(bodyParser.json());

    app.post('/', async (req, res) => {
        const { message } = req.body;
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {role: "system", content: process.env.SYSTEM_PROMPT},
                {role: "user", content: message},
            ],
            max_tokens: 100,
        });
        if (response.data.choices[0].message.content) {
            res.json({
                message: response.data.choices[0].message.content
            });
        }
    });

    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    });
