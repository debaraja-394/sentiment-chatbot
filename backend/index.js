const express = require('express');
const cors = require('cors');
const Sentiment = require('sentiment');

const app = express();
const sentiment = new Sentiment();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/api/chat',  (req,res) => {
    const {message} = req.body;
    if(!message) return res.status(400).json({error:"No message provided"});

    const result = sentiment.analyze(message);
    const score = result.score;

    let sentimentLabel = 'neutral';
    if (score>1) sentimentLabel = 'positive';
    else if(score<-1) sentimentLabel = 'negative';

    let reply = "Hmm, I see...";

    if(sentimentLabel === 'positive') reply = "I'm happy to hear that";
    if(sentimentLabel === 'negative') reply = "I'm here for you";

    return res.json({reply,sentiment: sentimentLabel});
});

app.listen(PORT,() => {
    console.log("Server is running on port ",PORT);
})