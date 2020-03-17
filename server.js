'use strict';

const ngrok = require('ngrok');

connectNgrok().then(url => {
    console.log('URL : ' + url);
});

// ngrokを非同期で起動
async function connectNgrok() {
    let url = await ngrok.connect(3000);
    return url;
}

const express = require('express');
const line = require('@line/bot-sdk');
const PORT = process.env.PORT || 3000;

const config = {
    channelSecret: '21ff478eef98947a62fd1f5336188e61',
    channelAccessToken: 'HeZvjK7yNacmJyYW+kP0EL0zoC1lolscfNV8Oz/rqr3+uoqXs8FP/lul8duidepOenTPWVgCEpTtuVEjlmbQW6kajZYqJL5ZckMAUiDj/MczQnP2NRGj4H0fZS0JildS7clT9iC1QDbhlXvVXF10MgdB04t89/1O/w1cDnyilFU='
};

const app = express();

app.get('/', (req, res) => res.send('Hello LINE BOT!(GET!!)')); //ブラウザ確認用(無くても問題ない)
app.post('/webhook', line.middleware(config), (req, res) => {
    console.log(req.body.events);

    //ここのif分はdeveloper consoleの"接続確認"用なので削除して問題ないです。
    if (req.body.events[0].replyToken === '00000000000000000000000000000000' && req.body.events[1].replyToken === 'ffffffffffffffffffffffffffffffff') {
        res.send('Hello LINE BOT!(POST)');
        console.log('疎通確認用');
        return;
    }

    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result));
});

const client = new line.Client(config);

function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }

    return client.replyMessage(event.replyToken, {
        type: 'text',
        text: event.message.text //実際に返信の言葉を入れる箇所
    });
}

// app.listen(PORT);
(process.env.NOW_REGION) ? module.exports = app : app.listen(PORT);
console.log(`Server running at ${PORT}`);