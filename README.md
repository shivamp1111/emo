LIVE LINKn : spiffy-biscotti-90e2f8.netlify.app

🧠 EmoCare+ : AI-Powered Mental Health Ecosystem

EmoCare+ is a multi-modal mental health platform integrating Artificial Intelligence, Blockchain, and Tele-health technologies. It not only tracks mental wellness but also incentivizes emotional positivity through “Wellness Mining” and provides instant access to mental health professionals.

🚀 Key Features & Technical Implementation
📊 AI Stress Monitoring Dashboard (Core Module)

User Functionality:

Daily input: Heart Rate, Steps, Sleep Hours, Age

Real-time Stress Score prediction (0–10)

7-day historical stress trends

Technical Implementation:

ML Model: Random Forest Regressor (Flask API)

Data Flow: React → /api/predict-stress → Flask Model → MongoDB

Charts: Recharts / Chart.js

😊 "Smile-to-Earn" (Blockchain Gamification) [cite: 1]

User Functionality:

Camera-based emotion detection

If “Happy” > 85% confidence → Earn 1 HAPY token

Internal & external wallet (MetaMask) support

Technical Implementation:

DeepFace for emotion detection

ERC-20 Smart Contract on Sepolia Testnet

Web3.py handles wallet, nonce, gas, secure transfer

🩺 Hybrid Tele-Therapy & Locator [cite: 2]

User Functionality:

Modes: Map View & Tele-Therapy View

Auto-location detection + nearby clinic map

Instant queue-based video consultation (browser only)

Technical Implementation:

Map: Leaflet.js + OpenStreetMap

Video: Embedded Jitsi Meet (WebRTC)

Queue Manager: MongoDB session workflow (pending → accepted)

🤖 "MindWell" Context-Aware Chatbot

User Functionality:

AI conversation with memory

Responses adapt to previous chats + current stress

Automatic crisis detection (suicide/harm keywords)

Technical Implementation:

LLM: Google Gemini API

RAG: Fetch chat history + stress from MongoDB → Inject into system prompt

🧘 CBT & Wellness Tools

User Functionality:

Guided Box Breathing animations

Structured CBT Journaling with saved entries

Technical Implementation:

Framer Motion for animations

REST API (/api/cbt-records) for saving & retrieving journal data

🏗 System Architecture & Tech Stack
Layer	Technology
Frontend	React.js
Styling	Tailwind CSS
Backend	Python Flask
Database	MongoDB Atlas
AI / ML	DeepFace, Scikit-Learn
GenAI	Google Gemini API
Blockchain	Solidity, Web3.py
Maps	Leaflet.js, OpenStreetMap
Video	Jitsi Meet
Hosting	Netlify (Frontend), Hugging Face (Backend)
🌟 Key Differentiators (For Project Defense)

Multi-Modal AI: Combines Numerical AI, Visual AI, and Textual AI

Web3 Wellness Mining: “Smile-to-Earn” emotional reward system

Seamless Care: Maps, Chatbot, and Tele-Therapy integrated into a single workflow
