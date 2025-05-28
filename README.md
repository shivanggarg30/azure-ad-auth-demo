Live Link (On Render) : https://azure-ad-auth-demo-1.onrender.com

This project uses React with Vite for the frontend and Node.js with Express for the backend. 
It integrates Azure Active Directory OAuth 2.0 for user authentication.
The backend handles the auth flow and exchanges the code from Entra ID for tokens using Microsoft Graph API. 
Upon successful login, user data is base64-encoded and passed to the frontend.

The settings in app configuration at Microsoft Azure allows only a single - tenant i.e. a single organization is authorized to 
serve login through this application that falls under the same Azure Active Directory Tenant.
