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
