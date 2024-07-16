const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const daprPort = process.env.DAPR_HTTP_PORT || 3500; // Dapr port for pub/sub

const daprPortUser = process.env.DAPR_HTTP_PORT_USER || 3500;
const userServiceAppId = 'user-service';

const daprPortNotification = process.env.DAPR_HTTP_PORT_NOTIFICATION || 3502;
const notificationServiceAppId = 'notification-service';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Endpoint to fetch news and send email to user
app.get('/process-news', async (req, res) => {
    const userId = req.query.userId;

    if (!userId) {
        return res.status(400).send('User ID is required');
    }

    try {
        // Fetch user preferences
        const userPreferences = await getUserPreferences(userId);

        // Fetch user email
        const userEmail = await getUserEmail(userId);

        // Fetch news articles based on user preferences
        const newsArticles = await fetchNewsArticles(userPreferences);

        // AI summarized news
        const summarizedNews = await generateSummaries(newsArticles);

        // Send email to user
        await sendEmail(userEmail, summarizedNews);

        res.status(200).send('News processed and email sent successfully');
    } catch (error) {
        console.error('Error processing news and sending email:', error.message);
        res.status(500).send('Error processing news and sending email');
    }
});

// Function to publish message using Dapr pub/sub
async function publishNews(email, news) {
    const message = { email, news };
    try {
        await axios.post(`http://localhost:${daprPort}/v1.0/publish/pubsub/news-updates`, message);
    } catch (error) {
        console.error('Error publishing news updates:', error.message);
        throw error;
    }
}

// Function to fetch user's preferences from User Service using Dapr service invocation API
async function getUserPreferences(userId) {
    try {
        const response = await axios.get(`http://localhost:${daprPortUser}/v1.0/invoke/${userServiceAppId}/method/preferences`, {
            params: { userId }
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching user preferences:', error.message);
        throw error;
    }
}

// Function to fetch user's email from User Service using Dapr service invocation API
async function getUserEmail(userId) {
    try {
        const response = await axios.get(`http://localhost:${daprPortUser}/v1.0/invoke/${userServiceAppId}/method/user/email/`, {
            params: { userId }
        });
        return response.data.email;
    } catch (error) {
        if (error.response) {
            console.error('Error fetching user email:', error.response.status, error.response.data);
        } else {
            console.error('Error fetching user email:', error.message);
        }
        throw error;
    }
}

// Function to fetch news articles based on user preferences (using NewsData.io or any other service)
async function fetchNewsArticles(preferences) {
    const apiKey = process.env.NEWS_API_KEY; 
    const query = preferences.join(','); 
    const apiUrl = `https://newsdata.io/api/1/latest?apikey=${apiKey}&q=${query}`;

    try {
        const response = await axios.get(apiUrl);
        return response.data.results;
    } catch (error) {
        console.error('Error fetching news:', error.message);
        throw error;
    }
}

// Function to generate summaries of the news with AI
async function generateSummaries(news) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
    const summarizedNews = await Promise.all(news.map(async (article) => {
      const prompt = `Summarize the following news article in 2-3 concise sentences:
      
      Title: ${article.title}
      Content: ${article.content}`;
  
      const result = await model.generateContent(prompt);
      const summary = result.response.text();
  
      return {
        ...article,
        summary,
      };
    }));
  
    return summarizedNews;
  }

  // Function to send email of the news to the user
  async function sendEmail(email, news) {
    try {
        const response = await axios.post(`http://localhost:${daprPortNotification}/v1.0/invoke/${notificationServiceAppId}/method/send-email`, {
            email,
            news
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error sending email:', error.response.status, error.response.data);
        } else {
            console.error('Error sending email:', error.message);
        }
        throw error;
    }
}

// Start the server
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`News Aggregator service listening on port ${port}`);
});
