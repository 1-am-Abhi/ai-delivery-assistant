# 🚚 ParcelPal

Your friendly AI assistant that handles delivery calls in Hindi and English, making package deliveries smoother for everyone.

---

## 🌟 Why ParcelPal?

📦 Ever waited for a delivery, only to:  
- 🤯 Struggle with Hindi-English code-mixed calls?  
- 📍 Explain “I live behind the temple, near chai stall” again and again?  
- 💸 Deal with confusion about COD, OTP, or delivery instructions?  

**ParcelPal fixes all of this.**  
Think of it as your multilingual friend who talks to delivery partners in Hindi + English seamlessly, making communication crystal clear.

---

## 🎯 What ParcelPal Does
✅ Multilingual Conversations – Hindi, English, Hinglish (natural switching)  
✅ Smart Address Resolution – Understands landmarks like *“next to chai stall”*  
✅ Delivery Coordination – COD, OTP, and instructions handled  
✅ Twilio Integration – Works with existing call flows  
✅ AI-Powered – Learns & improves with each call  

---

## 📊 Visual Call Flow

☎️ Incoming Call
↓
📞 Twilio Webhook
↓
🗄️ Call Log in Database
↓
🎤 Speech → OpenAI (Hindi/English mix)
↓
🧠 AI Response + Context Update
↓
✅ Delivery Complete!

yaml
Copy
Edit

---

## 🏗️ Architecture

**Monorepo with 3 Layers:**

parcel-pal/
├── client/ 🎨 React + TS (Frontend)
├── server/ ⚙️ Express + Twilio + OpenAI (Backend)
└── shared/ 🔄 Type-safe Schemas (DB + Validation)

yaml
Copy
Edit

**Tech Stack:**
- 🎨 Frontend: React, Shadcn/ui, Wouter, TanStack Query  
- ⚙️ Backend: Express, Drizzle ORM, PostgreSQL, Twilio API  
- 🔄 Shared: Zod + TypeScript schemas  

---

## 🗄️ Database Schema (Visual)

📂 users
└─ user_id | name | phone

📂 callLogs
└─ call_id | transcript | status

📂 deliverySettings
└─ user_id | COD | OTP | notes

📂 aiConfiguration
└─ voice_model | language | personality

yaml
Copy
Edit

---

## ⚡ Quick Start

```bash
# Clone
git clone https://github.com/1-am-Abhi/ai-delivery-assistant
cd parcel-pal

# Install
npm install

# Env setup
cp .env.example .env

# Run in Dev
npm run dev

# Push Schema
npm run db:push
📱 Example Conversation
👨 Customer: “Bhaiya, delivery mandir ke peeche chhod dena.”
🤖 ParcelPal: “ठीक है! Behind the temple noted. Will update delivery partner.”
📦 Result: Smooth delivery ✅

🌍 Designed for India
🇮🇳 ParcelPal understands:

Hinglish conversations (mix of Hindi + English)

Local landmarks (chai stall, kirana shop)

Indian phone formats (+91)

Cash on Delivery, OTP flows

🔌 API Endpoints
📞 Call Management
GET /api/calls → Fetch call logs

POST /api/calls → Create new call log

PUT /api/calls/:id → Update call status

⚙️ Settings
GET /api/settings/delivery → Get delivery config

PUT /api/settings/delivery → Update delivery config

GET /api/settings/ai → Get AI config

PUT /api/settings/ai → Update AI config

📞 Twilio Webhooks
POST /api/twilio/voice → Handle incoming call

POST /api/twilio/gather/:callId → Process speech

🛠️ Dev Tools
🟦 TypeScript everywhere
🛢️ Drizzle ORM + PostgreSQL
⚡ Vite + ESBuild for builds
✅ Zod for runtime validation

🚀 Deployment
🌐 Frontend → Vercel / Netlify
⚙️ Backend → Railway / Render
🛢️ Database → NeonDB (serverless Postgres)
📞 Voice Infra → Twilio

👀 Visual Demo Idea
You can add these visuals/screenshots/GIFs in README for better engagement:

📦 ParcelPal Logo + Mascot (Friendly robot with a delivery box 🤖)

🛠️ Call Flow Diagram (Twilio → AI → Delivery)

🖥️ Dashboard Screenshot (React UI with call logs + settings)

💬 Sample Conversation Card (Customer vs AI chat bubbles)

markdown
Copy
Edit
## 📸 Screenshots

### Dashboard
![Dashboard Screenshot](https://raw.githubusercontent.com/1-am-Abhi/ai-delivery-assistant/main/Assets/Dashboard.png)

### ParcelPal Mascot
![Mascot](https://raw.githubusercontent.com/1-am-Abhi/ai-delivery-assistant/main/Assets/robo-demo.png)
🤝 Contributing
Fork

Create branch

Commit

Open PR

✅ Follow TypeScript best practices
✅ Update docs when adding features

📧 Support
🐛 GitHub Issues

💬 Community Discussions

📖 Docs

✨ Final Tagline
ParcelPal – Making Indian deliveries human again. 🚚🇮🇳

Built with ❤️ for the Indian delivery ecosystem.
