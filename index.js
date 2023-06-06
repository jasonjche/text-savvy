const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

app.post('/', (req, res) => {
    res.json({
        message: "Hello from the server!"
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
