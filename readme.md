# 🍳 MoodChef 

### *The Emotional Intelligence of Home Cooking*

**MoodChef** is a robust, full-stack recipe discovery platform that prioritizes a **UX-first methodology**. Unlike traditional recipe databases, MoodChef maps culinary choices to emotional states, providing a seamless bridge between a user's mood and their meal.

---

### 💎 Core Architecture & UX

* **Mood-Based Taxonomy:** A custom discovery engine leveraging emotional tags (*Cozy, Fresh, Energetic*) to filter culinary content.
* **Design-First Implementation:** Built with **Framer Motion** for high-fidelity micro-interactions and a responsive UI optimized for the kitchen environment.
* **End-to-End Type Safety:** Utilizing a **Shared Schema** approach via **Zod**, ensuring strict data validation from the PostgreSQL layer to the React frontend.
* **Interactive Workflow:** A specialized "Cooking Mode" UI designed to minimize cognitive load during step-by-step execution.

---

### 🛠️ Technical Specifications

| Layer | Stack | Purpose |
| --- | --- | --- |
| **Frontend** | **React, TypeScript, Tailwind** | Modern, declarative UI with utility-first styling. |
| **Backend** | **Node.js, Express.js** | Modular REST API with middleware-based authentication. |
| **Database** | **PostgreSQL + Drizzle ORM** | Type-safe SQL operations with automated migrations. |
| **Validation** | **Zod** | Shared runtime validation and static type inference. |

---

### 📂 Repository Structure

```text
├── client/     # Frontend: React components, hooks, and UI logic
├── server/     # Backend: Express API, Auth, and Database controllers
├── shared/     # Cross-stack: Shared Zod schemas and TypeScript types
└── migrations/ # Infrastructure: Drizzle-generated SQL migrations

```

---

### 🚀 Deployment & Local Setup

1. **Initialize Environment:**
```bash
git clone <repository-url> && npm install

```


2. **Database Configuration:**
Ensure a PostgreSQL instance is running and provide the connection string in a `.env` file:
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/moodchef

```


3. **Schema Sync & Execution:**
```bash
npm run db:push && npm run dev

```


*The platform will serve at `http://localhost:5000`.*

---

### Developed by Nehal Mehta, Rushikesh Korde & Om Jumle
MoodChef is a sophisticated mood-based recipe discovery engine designed to bridge the gap between emotional cravings and culinary execution. By leveraging a modern tech stack, it provides users with a curated experience to find meals that match their current "vibe"—whether they are seeking comfort, energy, or a quick bite.

🚀 Technical Overview
The application is built using a robust full-stack architecture:

Frontend: A responsive, type-safe UI built with React 19 and TypeScript, styled using Tailwind CSS and enhanced with Framer Motion for fluid animations.

Backend: A high-performance Express.js server utilizing Drizzle ORM for seamless PostgreSQL interaction.

Data Integrity: Strict schema validation powered by Zod, ensuring data consistency between the database and the client.

✨ Key Features
Emotional Filtering: Discover recipes through mood-based tags such as Cozy, Comfort, Fresh, and Energized.

Advanced Explorer: Filter dishes by Cuisine (Italian, Asian, Indian, etc.), Dietary Type (Vegan, Keto, Paleo), and preparation time.

Interactive Cooking Mode: A dedicated view for step-by-step instructions and ingredient management.

Randomizer Engine: An integrated feature to suggest dishes for indecisive users.

Secure Infrastructure: Implementation of session management and passport-based authentication hooks.

🛠️ Installation & Setup
Prerequisites
Node.js: v20 or higher

PostgreSQL: Local or hosted instance

Step-by-Step Guide
Clone and Navigate:

Bash
git clone <repository-url>
cd MoodChef
Install Dependencies:

Bash
npm install
Environment Configuration:
Create a .env file in the root directory:

Code snippet
DATABASE_URL=postgresql://user:password@localhost:5432/moodchef
Synchronize Database Schema:

Bash
npm run db:push
Launch Development Environment:

Bash
npm run dev
The application will serve the client and API concurrently at http://localhost:5000.

📂 Architecture
/client: Contains the React frontend, featuring modular Radix UI components and custom hooks.

/server: Houses the Express API, storage logic, and recipe seeding scripts.

/shared: Centralized Zod schemas and TypeScript definitions used by both frontend and backend.

📝 License
This project is licensed under the MIT License.

Developed by Nehal Mehta and Rushikesh Korde.
