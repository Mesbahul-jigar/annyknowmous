# Annyknowmous - Anonymous Inbox System

A complete anonymous messaging platform where users can create accounts, get a public URL, and receive anonymous messages from anyone.

## Features

- 🔐 Secure user authentication with JWT and httpOnly cookies
- 📬 Anonymous message submission
- 🔗 Unique public link for each user
- 📱 Mobile-responsive design
- 🛡️ Built-in security features:
  - XSS prevention (using textContent instead of innerHTML)
  - Password hashing with bcryptjs
  - Rate limiting (1 message per 5 seconds per IP)
  - Input validation on both frontend and backend
- 🗑️ Message deletion functionality

## Tech Stack

- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Backend**: Vercel Serverless Functions (Node.js)
- **Database**: MongoDB Atlas
- **Authentication**: JWT with httpOnly cookies
- **Password Hashing**: bcryptjs

## Project Structure

```
annyknowmous/
├── api/                          # Backend API endpoints
│   ├── signup.js                 # User registration
│   ├── login.js                  # User authentication
│   ├── message.js                # Submit anonymous message
│   ├── messages.js               # Get user's messages
│   └── message/
│       └── [id].js               # Delete specific message
├── lib/                          # Helper utilities
│   ├── db.js                     # MongoDB connection
│   └── auth.js                   # JWT and cookie helpers
├── public/                       # Frontend files
│   ├── index.html                # Landing page
│   ├── signup.html               # Registration page
│   ├── login.html                # Login page
│   ├── u.html                    # Anonymous message form
│   ├── dashboard.html            # User dashboard
│   ├── css/
│   │   └── style.css             # Complete styling
│   └── js/
│       ├── index.js              # Landing page logic
│       ├── auth.js               # Signup/login logic
│       ├── publicMessage.js      # Message submission
│       └── dashboard.js          # Dashboard logic
├── package.json                  # Dependencies
├── vercel.json                   # Vercel configuration
└── .env.example                  # Environment variables template
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account (free tier)
- Vercel account (optional, for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mesbahul-jigar/annyknowmous.git
   cd annyknowmous
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up MongoDB Atlas**
   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster
   - Create a database user with read/write permissions
   - Get your connection string
   - Whitelist your IP address (or use 0.0.0.0/0 for development)

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your values:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/anonymous-inbox?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-change-this-to-something-random
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:3000`

### Deployment to Vercel

1. **Install Vercel CLI** (optional)
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```
   
   Or connect your GitHub repository to Vercel:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables in the Vercel dashboard:
     - `MONGODB_URI`
     - `JWT_SECRET`
   - Deploy!

3. **Add environment variables in Vercel Dashboard**
   - Go to Project Settings → Environment Variables
   - Add `MONGODB_URI` and `JWT_SECRET`
   - Redeploy if necessary

## Usage

### User Flow

1. **Sign Up**
   - Navigate to the landing page
   - Click "Create Inbox"
   - Fill in username, email, and password
   - Submit to create account

2. **Get Your Public Link**
   - After signup/login, you'll be redirected to the dashboard
   - Copy your unique public link (e.g., `https://yoursite.com/u.html?u=username`)
   - Share this link with others

3. **Receive Anonymous Messages**
   - Others visit your public link
   - They can send you anonymous messages
   - You'll see all messages in your dashboard

4. **Manage Messages**
   - View all received messages on your dashboard
   - Delete unwanted messages
   - Messages are sorted by newest first

## API Endpoints

### POST `/api/signup`
Register a new user
```json
Request: {
  "username": "john",
  "email": "john@example.com",
  "password": "secret123"
}

Response: {
  "success": true
}
```

### POST `/api/login`
Authenticate a user
```json
Request: {
  "identifier": "john",  // username or email
  "password": "secret123"
}

Response: {
  "success": true
}
```

### POST `/api/message`
Submit an anonymous message
```json
Request: {
  "recipientUsername": "john",
  "message": "Hello there!"
}

Response: {
  "success": true
}
```

### GET `/api/messages`
Get all messages for authenticated user (requires authentication)
```json
Response: {
  "messages": [
    {
      "_id": "123",
      "message": "Hello there!",
      "createdAt": "2026-02-15T10:00:00Z"
    }
  ],
  "username": "john"
}
```

### DELETE `/api/message/:id`
Delete a specific message (requires authentication)
```json
Response: {
  "success": true
}
```

## Security Features

### XSS Prevention
- All user-generated content is rendered using `textContent` instead of `innerHTML`
- No dangerous HTML injection possible

### Authentication
- JWT tokens stored in httpOnly cookies
- Tokens never exposed to frontend JavaScript
- 7-day token expiration

### Password Security
- All passwords hashed using bcryptjs with 10 salt rounds
- Plain passwords never stored or logged

### Rate Limiting
- Anonymous message submission limited to 1 message per 5 seconds per IP
- Prevents spam and abuse

### Input Validation
- Client-side validation for immediate feedback
- Server-side validation as source of truth
- Length limits enforced
- Empty messages rejected

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  username: String (unique, indexed, lowercase),
  email: String (unique, lowercase),
  passwordHash: String,
  createdAt: Date
}
```

### Messages Collection
```javascript
{
  _id: ObjectId,
  recipientUsername: String (indexed, lowercase),
  message: String (max 500 characters),
  createdAt: Date
}
```

## Development Notes

- No external frameworks (React, Vue, etc.) - pure vanilla JavaScript
- Mobile-first responsive design
- Maximum content width: 600px
- Touch-friendly buttons (minimum 44px height)
- Clean, minimal UI with neutral color palette

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for learning or production.

## Acknowledgments

Built as a complete anonymous messaging solution with security and user experience in mind.
