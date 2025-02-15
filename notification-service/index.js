const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

app.use(express.json());

// Endpoint to send email to user
app.post('/send-email', async (req, res) => {
    console.log('Received email request:', req.body);

    const { email, news } = req.body;
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Daily News Update',
        text: Array.isArray(Array) ? formatReadableArticles(news) : news //formatReadableArticles(news)
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }
        res.send('Email sent: ' + info.response);
    });
});

// Dapr subscription routes
app.get('/dapr/subscribe', (req, res) => {
    console.log('Dapr subscription route called');
    res.json([
        {
            pubsubname: "pubsub",
            topic: "news-updates",
            route: "send-email" 
        }
    ]);
});

// Function to formating the news articles
function formatReadableArticles(articles) {
    let formattedText = "";
    articles.forEach(article => {
        formattedText += `${article.title}\n`;
        formattedText += `${article.description}\n`;
        formattedText += `${article.link}\n\n`;
    });
    return formattedText.trim(); // Remove trailing newline
}

// Start the server
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Notification Service listening on port ${port}`);
});
