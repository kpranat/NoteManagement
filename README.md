# NoteManagement

A sophisticated note-taking application featuring AI-powered tools, tiered subscription models, and comprehensive administrative controls. This project is built with a React/TypeScript frontend and a Python/Flask backend, utilizing Supabase for database management.

## 🚀 Features

### 🧠 AI-Powered Insights (Premium)

Enhance your productivity with integrated AI capabilities designed for premium users:

* **Summarization**: Automatically generate concise summaries of long notes.
* **Action Items**: Extract actionable tasks directly from your note content.
* **Key Insights**: Identify the most important points within your documents.
* **Usage Tracking**: Built-in limits for AI usage based on subscription tiers (e.g., 5 requests for Free users, 100 for Pro).

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
