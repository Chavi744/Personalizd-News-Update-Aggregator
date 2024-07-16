# Personalizd-News-Update-Aggregator
Zionet Homework task

## Purpose
The News Aggregator System is designed to fetch news articles based on user preferences, summarize them using AI, and send the summarized news to the user's email. The system is composed of three microservices:

1. User Service: Manages user information and preferences.
2. News Aggregator Service: Fetches and summarizes news articles.
3. Notification Service: Sends the summarized news to the user's email.

## System Diagram
+----------------------+       +----------------------+       +----------------------+
|  User Service        |       |  News Aggregator     |       |  Notification Service|
|                      |       |  Service             |       |                      |
|  - Manages user info |<------|  - Fetches news      |<------|  - Sends email       |
|  - Provides user     |       |  - Summarizes news   |       |                      |
|    preferences       |       |  - Publishes news    |       |                      |
|                      |       |                      |       |                      |
+----------------------+       +----------------------+       +----------------------+
          ^                                   ^                           ^
          |                                   |                           |
          +-----------------------------------+---------------------------+
                               Dapr (Redis) for Pub/Sub

## Steps to Run the Application Locally
# Prerequisites
1. Docker (https://www.docker.com/products/docker-desktop)
2. Docker Compose (https://docs.docker.com/compose/)
3. Dapr CLI (https://docs.dapr.io/getting-started/install-dapr-cli/)
4. Environment Variables: Create a .env file in each service directory with the following variables:
    * PORT: The port on which the service will run.
    * DAPR_HTTP_PORT: The Dapr HTTP port.
    * EMAIL_USER: Your email address (for sending emails).
    * EMAIL_PASS: Your email password.
    * NEWS_API_KEY: API key for NewsData.io.
    * GEMINI_API_KEY: API key for Google Generative AI.

