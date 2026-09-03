# 🧭 YatraAI

<div align="center">

### 🌍 AI-Based Personalized Tourism & Dynamic Travel Planning Platform

**Smart India Hackathon (SIH) 2026 Project**

[🚀 Live Demo](https://yatra-ai-drab.vercel.app/) • [💻 GitHub Repository](https://github.com/yashpatil785/YATRA-AI)

**Plan Smarter. Adapt Faster. Travel Better. 🇮🇳**

</div>

---

## 🌐 Live Demo

🚀 **Experience YatraAI Live:**

👉 **https://yatra-ai-drab.vercel.app/**

YatraAI is deployed and accessible online. The live application demonstrates personalized trip planning, intelligent recommendations, itinerary optimization, budget estimation, and dynamic replanning.

---

# 📌 About the Project

## What is YatraAI?

**YatraAI** is an AI-powered intelligent tourism platform designed to make travel planning more personalized, adaptive, and efficient.

Planning a trip usually requires travelers to use multiple platforms for:

* Finding tourist attractions
* Creating itineraries
* Checking weather
* Managing budgets
* Calculating travel distances
* Finding alternative places
* Handling unexpected disruptions

YatraAI brings these planning processes together into a single intelligent platform.

Instead of generating a fixed itinerary, YatraAI focuses on creating a **personalized and adaptive travel experience**.

The system analyzes traveler preferences and recommends suitable destinations and attractions based on multiple factors such as interests, budget, distance, ratings, popularity, travel pace, and environmental context.

---

# 💡 Problem Statement

Traditional tourism platforms generally focus on a specific part of the travel journey.

For example:

| Existing Platform          | Primary Focus                    |
| -------------------------- | -------------------------------- |
| Google Maps                | Navigation and locations         |
| Travel Review Platforms    | Reviews and attraction discovery |
| Booking Platforms          | Hotel and travel booking         |
| Traditional Itinerary Apps | Static travel planning           |

However, travelers still face several challenges.

### Common Problems

❌ Too much time spent planning a trip

❌ Generic recommendations

❌ Difficulty managing travel budgets

❌ Static itineraries that cannot adapt

❌ Weather disruptions

❌ Unexpected changes in travel plans

❌ Difficulty selecting the best attractions

❌ Inefficient travel routes

❌ Multiple applications required for one trip

---

# 🚀 Our Solution

YatraAI provides an intelligent travel planning system that combines:

🧠 Artificial Intelligence

📍 Personalized Recommendations

🗺️ Route Optimization

💰 Budget Intelligence

🌦️ Context Awareness

🔄 Dynamic Replanning

🤖 AI Travel Assistance

The main goal is simple:

> **Instead of forcing travelers to manually adjust their plans, YatraAI helps the itinerary adapt to the traveler and changing situations.**

---

# ✨ Key Features

## 🎯 1. Personalized Trip Planning

YatraAI collects important traveler preferences before generating a trip.

The system considers:

* Destination
* Travel duration
* Number of travelers
* Travel interests
* Budget
* Travel pace
* Travel group
* Preferred transport
* Hotel location
* Accessibility preferences
* Dietary preferences

Using these preferences, YatraAI creates a personalized travel experience.

---

## 🧠 2. Intelligent Recommendation Engine

YatraAI does not simply recommend the most popular tourist places.

Each Point of Interest (POI) is evaluated using a **6-Factor Weighted Recommendation Algorithm**.

### Recommendation Factors

| Factor                  | Weight |
| ----------------------- | -----: |
| 🎯 Interest Match       |    30% |
| 🌦️ Context Match       |    20% |
| 📍 Distance             |    15% |
| ⭐ Rating                |    15% |
| 💰 Budget Compatibility |    10% |
| 🔥 Popularity           |    10% |

### Total Score

```text
Total Recommendation Score =

30% Interest Match
+ 20% Context Match
+ 15% Distance
+ 15% Rating
+ 10% Budget
+ 10% Popularity
```

The final score helps YatraAI rank attractions according to the traveler's requirements.

---

# 📊 How the Recommendation System Works

```text
Traveler Preferences
        ↓
Destination Selection
        ↓
Available Tourist Attractions
        ↓
6-Factor AI Scoring
        ↓
Context Analysis
        ↓
Distance Optimization
        ↓
Ranked Recommendations
        ↓
Personalized Itinerary
```

This approach provides more personalized recommendations compared to simply displaying the most popular locations.

---

# 🗺️ 3. Smart Multi-Day Itinerary

YatraAI automatically creates a structured multi-day travel plan.

The itinerary includes:

* 📅 Day-wise planning
* ⏰ Activity timings
* 📍 Tourist attractions
* 🚕 Transit information
* 🛣️ Travel distance
* 💰 Estimated cost
* 🌦️ Weather information
* ⭐ Recommendation score

The itinerary is generated according to the user's selected travel pace.

### Travel Pace Options

😌 Relaxed

⚖️ Moderate

⚡ Fast-Paced

This prevents the itinerary from becoming overloaded with too many activities.

---

# 📍 4. Route & Distance Optimization

YatraAI attempts to reduce unnecessary travel between tourist attractions.

The system considers the geographical position of attractions and calculates distances between locations.

The project uses the **Haversine Formula** to calculate geographical distance.

### Optimization Process

```text
Hotel / Starting Location
        ↓
Nearby High-Scoring Attraction
        ↓
Next Suitable Attraction
        ↓
Distance Adjustment
        ↓
Transit Estimation
        ↓
Optimized Travel Sequence
```

This helps reduce:

* Unnecessary travel
* Backtracking
* Travel time
* Transportation costs

---

# 🚕 5. Transportation Intelligence

YatraAI estimates transportation details based on the selected travel method.

Supported transport models include:

* 🚶 Walking
* 🛺 Auto Rickshaw
* 🏍️ Rental Bike
* 🚇 Metro
* 🚕 Cab

The system estimates:

* Distance
* Travel duration
* Estimated transportation cost
* Traffic level

---

# 🌦️ 6. Context-Aware Travel Planning

Travel conditions can significantly affect a trip.

YatraAI considers contextual information such as:

* Weather conditions
* Rain probability
* Time of day
* Indoor or outdoor attractions
* Crowd levels
* Attraction suitability

For example:

### 🌧️ Rainy Weather

If heavy rainfall occurs:

```text
Outdoor Attraction
        ↓
Weather Conflict Detected
        ↓
Find Indoor Alternatives
        ↓
Recalculate Recommendation Score
        ↓
Suggest Best Alternative
```

This allows the system to adapt recommendations according to changing conditions.

---

# 🔄 7. Dynamic Itinerary Replanning

One of the major innovations of YatraAI is **Dynamic Replanning**.

Traditional itinerary applications generate a travel plan and leave the traveler responsible for handling unexpected problems.

YatraAI attempts to solve this.

### Example Scenario

Imagine the traveler has planned:

🏖️ Beach Visit at 2:00 PM

Suddenly:

🌧️ Heavy Rainfall

⚠️ Water-Logging Alert

The system can:

### Step 1

Detect the conflict.

### Step 2

Identify the affected outdoor activity.

### Step 3

Find alternative attractions.

### Step 4

Prioritize weather-safe or indoor locations.

### Step 5

Recalculate recommendation scores.

### Step 6

Check budget and travel time.

### Step 7

Recalculate transit information.

### Step 8

Generate a new itinerary proposal.

---

## Dynamic Replanning Architecture

```text
Live Context / Alert
        ↓
Conflict Detection
        ↓
Affected Activity
        ↓
Alternative POIs
        ↓
AI Recommendation Scoring
        ↓
Budget Validation
        ↓
Time Validation
        ↓
Route Recalculation
        ↓
New Travel Plan
```

The traveler can then receive an understandable explanation for the change.

---

# 🤖 8. Gemini AI Integration

YatraAI integrates **Google Gemini AI** for intelligent natural-language interactions.

The AI system can help with:

💬 Travel assistance

🗺️ Trip planning

📍 Attraction explanations

🤔 "Why was this place recommended?"

🔄 Dynamic replanning explanations

The AI layer is integrated using server-side API routes.

---

# 💡 "Why This Place?" Feature

One important feature of YatraAI is **Recommendation Explainability**.

Instead of simply showing:

> Recommended Attraction: XYZ

The application can explain why the attraction was selected.

Example:

> This attraction was recommended because it strongly matches your interests, has a high visitor rating, is located near your current travel route, and fits your selected budget.

This makes AI recommendations easier for users to understand and trust.

---

# 💰 9. Budget Intelligence

Travel planning is not only about choosing places.

Budget management is also important.

YatraAI estimates the total trip cost.

### Budget Components

🏛️ Activities

🚕 Transportation

🍽️ Food

🏨 Stay

💰 Total Estimated Budget

The system also supports structured expense information.

---

# 👥 10. Collaborative Trip Planning

Travel is often planned with:

👨‍👩‍👧 Family

👫 Friends

💑 Couples

👥 Groups

YatraAI includes a collaboration-oriented data model for:

* Trip Owners
* Co-Planners
* Viewers
* Comments
* Sharing Configuration

This creates the foundation for collaborative trip planning.

---

# 🗺️ 11. Attractions Explorer

YatraAI allows users to explore tourist attractions.

Users can filter attractions based on:

📍 Destination

🏛️ Heritage

🏖️ Beaches

🌳 Nature

🛕

Spiritual Places

🛍️ Markets

🏛️ Museums

🎉 Experiences

This helps users discover locations before creating an itinerary.

---

# 🧭 12. Interactive Map

The application includes an interactive geographical travel view.

The map helps visualize:

* Tourist attractions
* Travel routes
* Trip locations
* Waypoints
* Travel circuits

This improves the user's understanding of the complete travel plan.

---

# 🏗️ System Architecture

```text
                 ┌─────────────────────┐
                 │     YatraAI UI      │
                 │ Next.js + React     │
                 └──────────┬──────────┘
                            │
                            ▼
              ┌───────────────────────────┐
              │      Trip Context         │
              │ Application State Manager │
              └──────────┬────────────────┘
                         │
          ┌──────────────┴──────────────┐
          │                             │
          ▼                             ▼
┌──────────────────────┐    ┌──────────────────────┐
│ Recommendation Engine│    │ Gemini AI API Routes │
│                      │    │                      │
│ • Interest Scoring   │    │ • Generate           │
│ • Context Scoring    │    │ • Chat               │
│ • Distance           │    │ • Explain            │
│ • Budget             │    │ • Replan             │
└───────────┬──────────┘    └──────────┬───────────┘
            │                          │
            ▼                          ▼
┌──────────────────────┐    ┌──────────────────────┐
│ Itinerary Optimizer  │    │ Google Gemini AI     │
│                      │    │                      │
│ • Route Sequence     │    │ Natural Language AI  │
│ • Transit Estimate   │    │ Explanations         │
│ • Budget Estimate    │    │ Travel Assistance    │
└───────────┬──────────┘    └──────────────────────┘
            │
            ▼
┌──────────────────────┐
│ Tourism Data / POIs  │
└──────────────────────┘
```

---

# 🛠️ Technology Stack

## Frontend

* ⚛️ React 19
* ▲ Next.js 15
* 🔷 TypeScript
* 🎨 Tailwind CSS
* ✨ Motion

## Artificial Intelligence

* 🤖 Google Gemini
* 🧠 Gemini API
* 🔌 Next.js API Routes

## Core Algorithms

* 🎯 Weighted Recommendation Algorithm
* 📍 Haversine Distance Formula
* 🗺️ Route Optimization
* 🔄 Dynamic Replanning

## Development Tools

* ESLint
* PostCSS
* npm / Bun
* GitHub
* Vercel Deployment

---

# 📁 Project Structure

```text
YATRA-AI
│
├── app
│   ├── api
│   │   └── ai
│   │       ├── chat
│   │       ├── explain
│   │       ├── generate
│   │       └── replan
│   │
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components
│   ├── AIAssistantDrawer
│   ├── AttractionsExplorer
│   ├── BudgetDashboard
│   ├── DynamicReplanningModal
│   ├── InteractiveMap
│   ├── LiveContextPanel
│   ├── TimelineItinerary
│   └── TripPlannerWizard
│
├── context
│   └── TripContext
│
├── lib
│   ├── data
│   │   └── mockData
│   │
│   ├── engine
│   │   ├── recommendation
│   │   ├── optimizer
│   │   └── context
│   │
│   ├── gemini
│   └── types
│
└── package.json
```

---

# ⚙️ Installation

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/yashpatil785/YATRA-AI.git
```

```bash
cd YATRA-AI
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Configure Environment Variables

Create:

```text
.env.local
```

Add:

```env
GEMINI_API_KEY=your_gemini_api_key
APP_URL=http://localhost:3000
```

⚠️ Never upload your API key to GitHub.

---

## 4️⃣ Run the Application

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 🚀 Deployment

YatraAI is deployed using **Vercel**.

### 🌐 Live Application

# 👉 https://yatra-ai-drab.vercel.app/

The deployed version allows users to experience the project directly without installing the repository locally.

---

# 🎯 Smart India Hackathon Innovation

## Why is YatraAI Different?

Many travel platforms provide:

❌ Maps

❌ Reviews

❌ Hotel bookings

❌ Static itineraries

YatraAI focuses on something different.

### 🧠 Adaptive Travel Intelligence

```text
Traveler Preferences
        +
Destination Information
        +
Budget
        +
Distance
        +
Weather Context
        +
Travel Conditions
        ↓
AI-Based Personalized Planning
        ↓
Dynamic Adaptation
```

---

## 🔥 Core Innovation

### 1. Hybrid Intelligence

YatraAI combines:

**Algorithm-Based Decision Making**

*

**Generative AI**

The recommendation engine handles structured scoring, while Gemini AI helps generate explanations and conversational assistance.

---

### 2. Dynamic Replanning

Instead of a fixed itinerary:

```text
Static Plan ❌
```

YatraAI aims for:

```text
Adaptive Plan 🔄
```

---

### 3. Explainable Recommendations

The user can understand:

> Why was this place recommended?

This improves transparency in AI-assisted decision-making.

---

### 4. Context-Aware Planning

Recommendations can change depending on conditions.

Example:

```text
Sunny Weather
→ Outdoor Attractions Preferred

Heavy Rain
→ Indoor Attractions Preferred
```

---

# 🎤 Presentation & Project Demonstration

YatraAI is designed with a strong focus on demonstrating the complete workflow during a presentation.

## Recommended Demo Flow

### Step 1: Introduce the Problem

Explain:

> Planning a trip requires multiple applications and static itineraries cannot adapt to changing conditions.

---

### Step 2: Show the Live Website

Open:

👉 **https://yatra-ai-drab.vercel.app/**

---

### Step 3: Enter Traveler Preferences

Demonstrate:

* Destination
* Budget
* Interests
* Travel duration
* Travel pace
* Number of travelers

---

### Step 4: Generate the Itinerary

Show how the system generates:

* Day-wise travel plans
* Attractions
* Timings
* Distance
* Transit
* Budget

---

### Step 5: Explain the Recommendation Engine

Show the 6-factor scoring system.

```text
Interest      → 30%
Context       → 20%
Distance      → 15%
Rating        → 15%
Budget        → 10%
Popularity    → 10%
```

---

### Step 6: Demonstrate Dynamic Replanning

This is one of the strongest parts of the project.

Introduce a scenario:

🌧️ Heavy Rainfall

The system:

```text
Detects Problem
      ↓
Identifies Affected Activity
      ↓
Finds Alternatives
      ↓
Ranks Alternatives
      ↓
Updates Route
      ↓
Creates New Proposal
```

---

### Step 7: Show AI Explanation

Demonstrate:

🤖 AI Travel Assistant

💡 Why This Place?

🔄 Why Was the Plan Changed?

---

### Step 8: Show Budget

Display:

💰 Activity Cost

🚕 Transport Cost

🍽️ Food Estimate

🏨 Stay Estimate

---

# 🏆 Best Presentation Closing

> **"YatraAI is not just a travel planning application. It is an adaptive tourism intelligence system."**

> **"Instead of giving every traveler the same popular destinations, YatraAI attempts to understand individual preferences, optimize the travel experience, and adapt when conditions change."**

> **"Our goal is simple: Plan Smarter, Adapt Faster, Travel Better."**

---

# 🔮 Future Scope

YatraAI can be expanded with:

🌦️ Real-time weather APIs

🚦 Live traffic integration

🗺️ Advanced maps and routing

🏨 Hotel booking integration

✈️ Flight and transportation integration

📍 Verified tourism databases

🎙️ Voice-based AI assistant

🌐 Multilingual support

📱 Mobile application

🔐 User authentication

☁️ Cloud database

👥 Real-time group collaboration

🧠 Machine learning personalization

---

# ⚠️ Current Project Scope

YatraAI is currently developed as a prototype for demonstration and innovation purposes.

Some tourism and contextual information currently uses structured local/mock data.

The architecture is designed so future versions can integrate real-time APIs and verified external data sources.

---

# 👨‍💻 Developer

**Yash Patil**

### GitHub

https://github.com/yashpatil785

### Project Repository

https://github.com/yashpatil785/YATRA-AI

### 🌐 Live Demo

# 🚀 https://yatra-ai-drab.vercel.app/

---

<div align="center">

# 🧭 YatraAI

### AI-Powered Personalized Tourism Platform

**Plan Smarter. 🧠**

**Adapt Faster. 🔄**

**Travel Better. 🌍**

🇮🇳 **Built for Smart India Hackathon 2026**

⭐ If you like the project, consider giving the repository a star!

</div>





