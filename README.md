# DoubtSnap AI 🎓✨

> **Clarity, instantly for every exam.** 
> An AI-powered study assistant that transforms how you learn by instantly resolving doubts and generating on-demand quizzes from your lecture PDFs.

---

## 🌟 Features

- **Instant Doubt Resolution**: Snap a photo or type out your questions, and our AI (powered by Google Gemini) will break down complex concepts into structured, easy-to-understand explanations.
- **Smart PDF Processing**: Upload your lecture PDFs and extract key points and summaries in seconds.
- **On-Demand Quiz Generation**: Want to test your knowledge? Generate custom, context-aware quizzes from your uploaded PDFs with a single click.
- **Beautiful, Cozy UI**: A premium, "Ink & Paper" aesthetic designed for focus and zero distractions. Built with Tailwind CSS v4 and animated beautifully with GSAP.
- **Secure Authentication**: Full JWT-based user authentication system ensuring your study materials and history are kept private and secure.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js with Vite
- **Styling**: Tailwind CSS v4 (Custom Design System)
- **Animations**: GSAP (GreenSock) & Reactbits
- **Icons**: Lucide React
- **Routing**: React Router DOM v6
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **AI Integration**: Google Gemini AI (Multimodal API)
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs
- **PDF Processing**: pdf-parse

---

## 🚀 Getting Started

Follow these steps to run DoubtSnap locally on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/ORION-16/DoubtSnap.git
cd DoubtSnap
```

### 2. Backend Setup
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory and add the following variables:
```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_google_gemini_api_key
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window, navigate to the client directory, and install dependencies:
```bash
cd client
npm install
```

Start the Vite development server:
```bash
npm run dev
```

### 4. Open the App
The frontend will run on `http://localhost:5173`. Open this URL in your browser to start studying!

---

## 📁 Project Structure

```text
DoubtSnap/
├── client/                 # React Frontend
│   ├── public/             # Static assets (Favicons, SVG)
│   ├── src/
│   │   ├── api/            # Axios instance and interceptors
│   │   ├── components/     # Reusable UI components (Buttons, Navbars)
│   │   ├── context/        # React Context (AuthContext)
│   │   ├── lib/            # Utility libraries (GSAP configs)
│   │   └── pages/          # Full page views (Dashboard, PDF, Landing)
│   └── index.html
│
└── server/                 # Node/Express Backend
    ├── controllers/        # Route controllers (Auth, PDFs, Doubts)
    ├── middleware/         # Custom middleware (Auth Guard, Rate Limiter)
    ├── models/             # Mongoose Database Schemas
    ├── routes/             # Express API Routes
    └── utils/              # Helper utilities (Gemini API integrations)
```

---

## 🤝 Contributing

Contributions are always welcome! Feel free to open an issue or submit a pull request if you'd like to improve the codebase or add new features.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

*Designed and built to make studying less stressful and more effective.*
