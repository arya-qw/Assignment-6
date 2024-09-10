const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const fs = require('fs');
const querystring = require ('querystring');

dotenv.config();
const app = express();
app.use(express.json());

const OAUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';

app.listen(process.env.PORT, () => {
    console.log('Running on PORT', + process.env.PORT);
});


// Initiate Endpoint
app.get('/auth/initiate', (req, res) => {
    const params = {
      client_id: process.env.CLIENT_ID,
      redirect_uri: process.env.REDIRECT_URI,
      response_type: 'code',
      scope: 'https://www.googleapis.com/auth/gmail.send',
      access_type: 'offline',
      prompt: 'consent',
    };
  
    const authUrl = `${OAUTH_URL}?${querystring.stringify(params)}`;
    res.redirect(authUrl);
  });
  

// Callback Endpoint
app.get('/auth/callback', async (req, res) => {
    const code = req.query.code;
  
    const tokenData = {
      code,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: 'authorization_code',
    };
  
    try {
      const response = await axios.post(TOKEN_URL, querystring.stringify(tokenData), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
  
      // Save tokens in a file
      fs.writeFileSync('tokens.json', JSON.stringify(response.data, null, 2));
  
      res.send('OAuth successful! Tokens saved.');
    } catch (error) {
      console.error('Error exchanging code for tokens:', error.response?.data || error.message);
      res.status(500).send('Authentication failed');
    }
  });
  
// Send Endpoint
app.post('/email/send', async (req, res) => {
    const { to, subject, body } = req.body;
  
    if (!to || !subject || !body) {
      return res.status(400).send('Missing email parameters');
    }
  
    try {
      // Load OAuth tokens from the file
      let tokens;
        try {
        tokens = JSON.parse(fs.readFileSync('tokens.json'));
        } catch (error) {
        return res.status(500).send('No tokens available. Please authenticate first.');
        }
  
      // Create the email message in base64-encoded format
      const email = [
        `To: ${to}`,
        `Subject: ${subject}`,
        '',
        `${body}`,
      ].join('\n');
  
      const encodedMessage = Buffer.from(email)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
  
      // Send the email using Gmail API
      const gmailResponse = await axios.post(
        'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
        { raw: encodedMessage },
        {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      res.status(200).send('Email sent successfully!');
    } catch (error) {
      console.error('Error sending email:', error.response?.data || error.message);
      res.status(500).send('Failed to send email');
    }

    // Refresh tokens
    async function refreshAccessToken(refresh_token) {
        const tokenData = {
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          refresh_token,
          grant_type: 'refresh_token',
        };
      
        const response = await axios.post(TOKEN_URL, querystring.stringify(tokenData), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
      
        // Update tokens.json with new tokens
        fs.writeFileSync('tokens.json', JSON.stringify(response.data, null, 2));
        return response.data.access_token;
      }      
  });
  

    