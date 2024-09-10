# Gmail API Email Sender with OAuth 2.0 Authentication

To send emails through the Gmail API using OAuth 2.0 authentication.

## Prerequisites
- **Node.js** installed on your machine.
- **Google API Credentials (OAuth 2.0 Client ID and Secret)**.
- A Gmail account to send emails.

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/arya-qw/Assignment-6.git
Assignment-6
```

### Step 2: Install Dependencies

Install the required packages using npm:

```bash
npm install
```

### Step 3: Setup Environment Variables

Create a `.env` file in the project root with the following content:

```bash
CLIENT_ID=your_google_client_id
CLIENT_SECRET=your_google_client_secret
REDIRECT_URI=http://localhost:3000/auth/callback
PORT=3000
```

Replace `your_google_client_id` and `your_google_client_secret` with your actual credentials from the Google Cloud Console.

## Running the Application

Start the Node.js server:

```bash
node app.js
```

The application should now be running on `http://localhost:3000`.

## OAuth 2.0 Authentication Flow

### Step 1: Initiate the Authentication Flow

To initiate the OAuth 2.0 flow, navigate to the following URL in your browser:

```
http://localhost:3000/auth/initiate
```

This will redirect you to the Google login and consent screen. After successful authentication, Google will redirect back to the `/auth/callback` endpoint and the tokens will be saved locally.

### Step 2: Sending Emails

Once authenticated, you can send an email by making a POST request to:

```
POST http://localhost:3000/email/send
```

#### Request Body Format:

```json
{
  "to": "recipient@example.com",
  "subject": "Test Subject",
  "body": "This is the body of the email."
}
```

## Token Management

- The OAuth tokens are saved in the `tokens.json` file.
- If the access token expires, the application will use the refresh token to obtain a new access token automatically.

## Project Structure

```
├── index.js          # Main server file handling the API routes
├── package.json      # Project dependencies and scripts
├── .env              # Environment variables (OAuth credentials)
├── tokens.json       # OAuth tokens (created after successful authentication)
└── README.md         # Project documentation
```

## Dependencies

- [Express](https://expressjs.com/) - Web framework for Node.js.
- [axios](https://www.npmjs.com/package/axios) - Promise-based HTTP client for the Gmail API.
- [dotenv](https://www.npmjs.com/package/dotenv) - To load environment variables from a `.env` file.
- [fs](https://nodejs.org/api/fs.html) - Node.js File System module to handle token file operations.

