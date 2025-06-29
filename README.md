# Feedback System Application


## Deployment

* Frontend (production): https://feed-back-system-omega.vercel.app/login

* Backend API docs: https://feedback-system-oy6j.onrender.com/docs

  
## Demo Videos

* **Product Demo (≤5 min):** [[Link](https://www.loom.com/share/140a7a31fb7544b390324f564e848147?sid=5c87e0a3-42fd-473c-85ef-c9045d22bb64)]
* **Code Walkthrough (≤10 min):** [[link](https://www.loom.com/share/2c9b2d2675a74639a3aa2eace79c2f0c?sid=7da31fa6-5a7c-4a4a-9b24-2afcfa5f04ff)]()

## Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/kami123kaze/Feedback_system.git
   cd feedback-system/frontend
   ```

2. **Install dependencies**

   * **Frontend** (React, Vite, Tailwind):

     ```bash
     npm install
     npm run dev
     ```
   * **Backend** (FastAPI, SQLite):

     ```bash
     cd ../backend
     pip install -r requirements.txt
     uvicorn main:app --reload
     ```

3. ## Environment configuration

* * No additional environment variables are required for local development; the database file path is determined automatically in database.py and the JWT_SECRET_KEY is coded in jwt.py.
* * However if needed they can be configured likewise.

     ```ini
     SECRET_KEY=your-secret-key
     DATABASE_URL=sqlite:///./app.db
     ```

4. **Run with Docker (backend only)**

   ```bash
   # In the backend directory
   docker build -t feedback-backend .
   docker run -p 8000:8000 feedback-backend
   ```

5. **Access the application**

   * Frontend: `http://localhost:5173`
   * API documentation: `http://localhost:8000/docs`

## Technology Stack and Design Decisions

* **Frontend**

  * React with Vite for fast development
  * Tailwind CSS for utility-first styling
  * React Router v6 for routing
  * Axios for HTTP requests and authentication flows

* **Backend**

  * FastAPI for high-performance REST API and automatic documentation
  * SQLite for simplicity in development 
  * JWT-based authentication with role-based access control
  * SQLAlchemy as ORM
  * CORS middleware configured for production domains

* **Deployment**

  * Frontend deployed on Vercel with SPA rewrite configuration
  * Backend deployed on Render
  * Docker used to containerize the backend application

## Project Structure

```
frontend/       # React application
├─ src/
├─ public/
└─ package.json

backend/        # FastAPI application
├─ app/
│  ├─ main.py
│  ├─ models.py
│  ├─ schemas.py
│  ├─ api/
│  └─ database.py
├─ Dockerfile
├─ requirements.txt
└─ .env.example
```

## Completed Features

* Authentication and role-based routing (Manager and Employee)
* Managers can create, read, update, delete feedback and can view, assign, dismiss employees in their teams.
* Employees can view and acknowledge feedback meant for them only.
* Role-specific dashboards
* Dark theme implemented with Tailwind CSS
* Dockerfile provided for backend

## AI Assistance

* This project utilized AI tools to enhance development efficiency and code quality in the following ways:

* Styling: Generated Tailwind CSS patterns and design suggestions for a consistent dark-glossy theme.

* Persistence: Consulted documentation via AI to handle persistent storage strategies and CORS configuration.

* Bug Fixing: Employed AI-assisted troubleshooting to identify issues and review official docs for accurate solutions.

* All AI-generated recommendations were reviewed and integrated manually to ensure alignment with project requirements.
  
* (AI WAS ASLO USED TO WRITE SOME  PARTS OF THIS VERRRRRRRY LONG README)

