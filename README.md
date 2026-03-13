# Note Management
NoteManagement is a smart note-taking app designed to help you stay organized. It features a simple two-tier system: basic notes for everyone, and AI-powered tools for Pro users.
​Built with React (Frontend), Python/Flask (Backend), and Supabase (Database).

## Features

### 
AI-Powered Insights (Premium)

Enhance your productivity with integrated AI capabilities designed for premium users:

* ​Summarize: Instantly turn long notes into  short, readable summaries.
*​Action Items: Automatically extract a "To-Do" list from your text.
* ​Key Insights: Quickly identify the most important points.
*​Daily Limits: Pro users get 45 AI requests per day.

### 💳 Subscription Management

A robust tier system to manage user access and monetization:

* **Tiered Access**: Supports Free, Pro, and Enterprise levels.
* **Feature Gating**: Restricts advanced features like AI tools to higher-tier subscribers.
* **Usage Quotas**: Dynamically tracks and resets monthly AI usage quotas.

### 🛡️ Admin Role-Based Access Control (RBAC)

Dedicated administrative tools for platform management:

* **User Management**: View all registered users and manage their account status.
* **Note Oversight**: Global visibility into notes across the platform for moderation.
* **Role Promotion**: Capability to promote standard users to Admin status.
* **Secure Access**: Protected routes ensuring only authorized personnel can access the Admin Dashboard.

## 🛠️ Tech Stack

* **Frontend**: React, TypeScript, Vite, Tailwind CSS.
* **Backend**: Python, Flask, SQLAlchemy.
* **Database**: Supabase (PostgreSQL).

## 🏁 Quick Start

### Prerequisites

* Python 3.8+.
* Node.js 18+ and npm.
* Supabase Account and Project.

### Backend Setup

1. Navigate to the `backend` directory.
2. Install dependencies:
```bash
pip install -r requirements.txt

```


3. Configure your environment variables in a `.env` file (see `.env.example` for required keys like `SUPABASE_URL` and `SUPABASE_KEY`).
4. Run database migrations:
```bash
python migrate_subscription.py
python migrate_role.py

```


5. Start the Flask server:
```bash
python run.py

```



### Frontend Setup

1. Navigate to the `frontend` directory.
2. Install dependencies:
```bash
npm install

```


3. Start the development server:
```bash
npm run dev

```



## 📂 Project Structure

* `/backend`: Flask API, database models, and migration scripts.
* `/frontend`: React application, UI components, and service layers.
* `/docs`: Detailed feature documentation for AI, Admin, and Subscriptions.

## 📄 License

This project is licensed under the terms provided in the [LICENSE](https://www.google.com/search?q=LICENSE) file.
