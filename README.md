# Personalizd-News-Update-Aggregator
Zionet Homework task

## Purpose
The News Aggregator System is designed to fetch news articles based on user preferences, summarize them using AI, and send the summarized news to the user's email. The system is composed of three microservices:

1. User Service: Manages user information and preferences.
2. News Aggregator Service: Fetches and summarizes news articles.
3. Notification Service: Sends the summarized news to the user's email.

## System Diagram
```
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
```
# Steps to Run the Application Locally
## Prerequisites
1. Docker and Docker Compose installed
    * Docker (https://www.docker.com/products/docker-desktop)
    * Docker Compose (https://docs.docker.com/compose/)
2. Dapr CLI installed
    * Dapr CLI (https://docs.dapr.io/getting-started/install-dapr-cli/)
3. Node.js and npm installed

## Clone the Repository

```bash
git clone <repository-url>
cd <repository-directory>
```

## Set Up Environment Variables

-Update the .env file in news-aggregator-service directory with the following variables:
```env
PORT=The port on which the service will run.
NEWS_API_KEY=API key for NewsData.io.
GEMINI_API_KEY=API key for Google Generative AI.
DAPR_HTTP_PORT_USER = The Dapr HTTP port of user-service
DAPR_HTTP_PORT_NOTIFICATION = The Dapr HTTP port of notification-service
DAPR_HTTP_PORT = The Dapr HTTP port
```
-Update the .env file in user-service directory with the following variables:
```env
PORT=The port on which the service will run
MONGODB_URI=MongoDB uri
```
-Update the .env file in notification-service directory with the following variables:
``env
PORT=The port on which the service will run
EMAIL_USER=our email address (for sending emails).
EMAIL_PASS=Your email password.
```

## Build and Run the Services
Use Docker Compose to build and run the services.
```bash
docker-compose up --build
```
This command will start all the microservices along with MongoDB and Redis.

