# 🚚 AI-DELIVERY-AGENT

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

- ✅ Multilingual Conversations – Hindi, English, Hinglish (natural switching)  
- ✅ Smart Address Resolution – Understands landmarks like *“next to chai stall”*  
- ✅ Delivery Coordination – COD, OTP, and instructions handled  
- ✅ Twilio Integration – Works with existing call flows  
- ✅ AI-Powered – Learns & improves with each call  

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

text

---

## 🏗️ Architecture

**Monorepo with 3 Layers:**

parcel-pal/
├── client/ 🎨 React + TypeScript (Frontend)
├── server/ ⚙️ Express + Twilio + OpenAI (Backend)
└── shared/ 🔄 Type-safe Schemas (DB + Validation)

text

**Tech Stack:**

- 🎨 Frontend: React, Shadcn/ui, Wouter, TanStack Query  
- ⚙️ Backend: Express, Drizzle ORM, PostgreSQL, Twilio API  
- 🔄 Shared: Zod + TypeScript schemas  

---

## 🗄️ Database Schema

**users**

| user_id | name | phone |

**callLogs**

| call_id | transcript | status |

**deliverySettings**

| user_id | COD | OTP | notes |

**aiConfiguration**

| voice_model | language | personality |

---

## ⚡ Quick Start

Clone repo
git clone https://github.com/1-am-Abhi/ai-delivery-assistant
cd ai-delivery-assistant

Install dependencies
npm install

Setup environment variables
cp .env.example .env

Run locally in dev mode
npm run dev

Push database schema
npm run db:push

text

---

## 🌍 Designed for India

- Hinglish conversations (Hindi + English code-mixed)  
- Local landmarks (chai stall, kirana shop, mandir)  
- Indian phone number formats (+91)  
- Cash On Delivery & OTP verification flows  

---

## 🔌 API Endpoints

**Call Management**

- `GET /api/calls` — Fetch call logs  
- `POST /api/calls` — Create new call log  
- `PUT /api/calls/:id` — Update call status  

**Settings**

- `GET /api/settings/delivery` — Get delivery config  
- `PUT /api/settings/delivery` — Update delivery config  
- `GET /api/settings/ai` — Get AI config  
- `PUT /api/settings/ai` — Update AI config  

**Twilio Webhooks**

- `POST /api/twilio/voice` — Handle incoming call  
- `POST /api/twilio/gather/:callId` — Process speech from delivery agent  

---

## 👀 Visual Demo

![Dashboard Screenshot](https://raw.githubusercontent.com/1-am-Abhi/ai-delivery-assistant/main/Assets/Dashboard.png)

## 🤝 Contributing

- Fork the repo  
- Create a new branch  
- Make your changes  
- Push and open a pull request  
- Follow TypeScript best practices  
- Update docs where applicable  

---

## 📧 Contact & Support

- Report issues on [GitHub Issues](https://github.com/1-am-Abhi/ai-delivery-assistant/issues)  
- Join community discussions  
- Refer to documentation for advanced setup  

---

## ✨ Tagline

AI-DELIVERY-AGENT – Making Indian deliveries human again. 🚚🇮🇳  
Built with ❤️ for the Indian delivery ecosystem.
