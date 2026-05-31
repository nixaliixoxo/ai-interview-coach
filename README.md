🎯 AI Interview Coach

AI Interview Coach is an AI-driven interview preparation platform built with the MERN stack and OpenROuter API, designed to help candidates excel in technical and behavioral interviews through realistic mock interview experiences. The platform leverages voice-enabled interactions, speech recognition, and intelligent response evaluation to simulate real-world interview scenarios.

Users can participate in AI-generated interview sessions, receive instant and personalized feedback, analyze their strengths and areas for improvement through comprehensive performance reports, and track their progress over time. By combining conversational AI, detailed analytics, and an intuitive user experience, AI Interview Coach bridges the gap between preparation and actual interviews, empowering candidates to enhance their communication, problem-solving, and interview skills with confidence.

## 🚀 Features

* 👤 User authentication and authorization
* 🤖 AI-generated interview questions based on role, experience, mode and user's resume (optional)
* 🎤 Voice-based interview sessions
* 📊 Detailed performance analysis
* 📈 Question-wise scoring and feedback
* 📄 Downloadable interview reports (PDF)
* 📚 Interview history tracking
* 💳 Razorpay payment integration to buy interview credits 
* 🎨 Modern and responsive UI

---

## 🌐 Live Demo

**Frontend:** https://ai-interview-coach-client.onrender.com

**Backend API:** https://ai-interview-coach-backend-pyqi.onrender.com

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Redux Toolkit
* Axios
* Firebase
* Recharts
* Framer Motion

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Razorpay API 

### AI & Other Services

* OpenAI API
* Browser Speech Recognition (Voice-to-Text)
*  Browser Speech Synthesis (Text-to-Speech)
* PDF Generation (jsPDF)

---

## 📂 Project Structure

```bash
AI-Interview-Coach/
│
├── client/
│   │
│   ├── src/
│   │   ├── assets/              # Images, icons, and static assets
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Application pages
│   │   ├── redux/               # Redux store and slices
│   │   ├── utils/               # Helper and utility functions
│   │   ├── App.jsx              # Main application component
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx             # React entry point
│   │
│   ├── index.html
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── package.json
│   ├── package-lock.json
│   ├── .gitignore
│   └── README.md
│
├── server/
│   │
│   ├── config/                 # Database and application configuration
│   ├── controllers/            # Route controller logic
│   ├── middlewares/            # Authentication & custom middleware
│   ├── models/                 # MongoDB/Mongoose models
│   ├── public/                 # Static files and generated reports
│   ├── routes/                 # API routes
│   ├── services/               # AI, payment, and business logic services
│   ├── index.js                # Server entry point
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── .gitignore
│
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/nixaliixoxo/ai-interview-coach.git
```

### 2. Move into Project Folder

```bash
cd ai-interview-coach
```

### 3. Install Frontend Dependencies

```bash
cd client
npm install
```

### 4. Install Backend Dependencies

```bash
cd server
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file inside the server folder.

```env
PORT=8000

MONGO_URL=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

OPENROUTER_API_KEY=your_gemini_api_key

RAZORPAY_KEY_ID=your_razorpay_key_id

RAZORPAY_KEY_SECRET=your_razorpay_secret
```

Create a `.env` file inside the client folder.

```env
VITE_FIREBASE_APIKEY=your_firebase_api_key

VITE_RAZORRPAY_KEY_ID=your_razorpay_key_id
```

---

## ▶️ Running the Project

### Start Backend

```bash
cd server
npm run dev
```

### Start Frontend

```bash
cd client
npm run dev
```

Frontend:

```bash
http://localhost:5173
```

Backend:

```bash
http://localhost:8000
```

---

## 🔌 API Endpoints

### Authentication

```http
POST /api/auth/google
GET /api/auth/logout
```

### User

```http
GET /api/user/current-user
```

### Interview

```http
POST /api/interview/resume
POST /api/interview/generate-questions
POST /api/interview/submit-answer
POST  /api/interview/finish-interview
GET  /api/interview/get-interviews
GET /api/interview/report:id 
```

### Payments

```http
POST /api/payment/order
POST /api/payment/verify
```

---

## 📊 How It Works

1. User authenticates using Google Sign-In via Firebase Authentication.
2. User selects the desired interview type & enters role and experience.
3. OpenRouter AI generates personalized interview questions.
4. The interview is conducted smoothly using voice interaction, speech recognition and typed answers.
5. User responses are analyzed and evaluated by AI.
6. Detailed feedback, scores, and performance insights are generated.
7. A comprehensive interview report is displayed.
8. Users can download their report as a PDF for future reference.
9. Premium plans and additional interview credits can be purchased through Razorpay.

---

## 🔮 Future Improvements

* Video interview support
* AI-powered resume analysis
* Company-specific interview simulations
* Personalized preparation roadmap
* Leaderboard and ranking system
* Interview scheduling and reminders

---

## 👩‍💻 Author

**Neelakshi Sachdeva**

GitHub: https://github.com/nixaliixoxo

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

Contributions, suggestions, and feedback are always welcome.
