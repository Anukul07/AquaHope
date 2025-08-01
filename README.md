#AquaHope
###Secure Donation Platform to Donate for Drinking Water Project Campaigns across Africa.
AquaHope is a secure MERN-stack donation web application supporting clean water projects across Africa. Users can register, donate, and manage campaigns with the peace of mind that their data and donations are protected by best-in-class security controls.

🚀 Features

User Registration & Secure Login (MFA, Email Verification)
Create & Browse Water Campaigns
Make Secure Donations (Stripe)
Admin Panel & Role-Based Access Control
Modern, Responsive UI

🔒 Security Measures Control / Measure Description

- Input Validation & Sanitization All inputs sanitized server-side (sanitize-html, express-mongo-sanitize) to prevent XSS and NoSQLi.
- Strong Password Policy Passwords must meet complexity standards and are hashed with bcrypt.
- JWT in httpOnly Cookies Tokens issued as httpOnly, SameSite cookies—safe from JavaScript/XSS.
- Multi-Factor Authentication (MFA) MFA enforced on registration, login, and sensitive actions.
- Rate Limiting & Brute-Force Protection express-rate-limit locks out after repeated failed attempts.
- CSRF & CORS Mitigation Strict CORS policy; cookies are SameSite=lax to prevent cross-site attacks.
- Access Control & RBAC Role-based access, admin-only endpoints protected by middleware.
- Audit Logging Key events logged securely for monitoring and incident response.
- HTTPS by Default All data transmitted securely over SSL/TLS.
- Security Headers Helmet sets Content Security Policy, HSTS, and more.

📦 Tech Stack

- Frontend: React.js (Vite), Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB
- Payments: Stripe

Authentication: JWT, MFA, bcrypt

🏁 Quick Start
   Clone the repo
   git clone https://github.com/yourusername/aquahope.git

    Install dependencies
    cd aquahope && npm install

    Set up environment variables including stripe public key

💡 Why AquaHope?
By combining world-class security with an accessible donation platform, AquaHope enables donors and organizers to make a real impact—securely and transparently.
