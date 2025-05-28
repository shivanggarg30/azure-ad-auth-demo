const express = require('express');
const axios = require('axios');
const router = express.Router();
const qs = require('qs');

const {
  CLIENT_ID,
  CLIENT_SECRET,
  TENANT_ID,
  REDIRECT_URI,
  FRONTEND_URL,
} = process.env;

if (!CLIENT_ID || !CLIENT_SECRET || !TENANT_ID || !REDIRECT_URI || !FRONTEND_URL) {
  throw new Error('Missing required environment variables');
}

const AUTH_URL = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0`;
const GRAPH_URL = 'https://graph.microsoft.com/v1.0/me';

// Redirect user to Microsoft login
router.get('/login', (req, res) => {
  const url = new URL(`${AUTH_URL}/authorize`);
  url.searchParams.set('client_id', CLIENT_ID);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('redirect_uri', REDIRECT_URI);
  url.searchParams.set('response_mode', 'query');
  url.searchParams.set('scope', 'openid profile email User.Read');
  url.searchParams.set('state', 'auth_state_' + Date.now());
  url.searchParams.set('prompt', 'login');
  res.redirect(url.toString());
});

// Callback after Microsoft login
router.get('/callback', async (req, res) => {
  const { code, error, error_description } = req.query;

  if (error) {
    return res.redirect(`${FRONTEND_URL}/?error=${encodeURIComponent(error_description || error)}`);
  }

  if (!code) {
    return res.redirect(`${FRONTEND_URL}/?error=No authorization code received`);
  }

  try {
    const tokenResponse = await axios.post(
      `${AUTH_URL}/token`,
      qs.stringify({
        client_id: CLIENT_ID,
        scope: 'User.Read',
        code,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
        client_secret: CLIENT_SECRET,
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    const { access_token } = tokenResponse.data;
    if (!access_token) throw new Error('No access token received');

    const userResponse = await axios.get(GRAPH_URL, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const userData = userResponse.data;
    const userInfo = {
      name: userData.displayName,
      email: userData.mail || userData.userPrincipalName,
      jobTitle: userData.jobTitle,
      department: userData.department,
      id: userData.id,
    };

    const userInfoEncoded = Buffer.from(JSON.stringify(userInfo)).toString('base64');
    res.redirect(`${FRONTEND_URL}/?user=${userInfoEncoded}`);
  } catch (error) {
    const errorMessage = error.response?.data?.error_description || error.message;
    res.redirect(`${FRONTEND_URL}/?error=${encodeURIComponent(errorMessage)}`);
  }
});

// Logout endpoint
router.get('/logout', (req, res) => {
  const logoutUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/logout?post_logout_redirect_uri=${encodeURIComponent(FRONTEND_URL)}`;
  res.redirect(logoutUrl);
});

module.exports = router;