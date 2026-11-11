# PayMesh — Full-Stack Payment Management Platform

PayMesh is a full-stack payment management application built to demonstrate backend payment processing, relational database integration, REST API development, and frontend integration.

The project uses a FastAPI backend, PostgreSQL database, and React frontend, with Docker Compose for local development.

## Features

- Account creation and retrieval
- Payment processing between accounts
- Database-backed account balance updates
- Ledger entries for payment activity
- Idempotency-key support for repeated payment requests
- REST API documentation through Swagger UI / OpenAPI
- React + TypeScript frontend
- Docker Compose setup for the backend and PostgreSQL database

> Project status: actively developed. Only claim features that you have run and verified in your local copy.

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite, CSS |
| Backend | Python, FastAPI |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| API documentation | OpenAPI, Swagger UI |
| Containers | Docker, Docker Compose |
| Tests | Pytest |

## Project Structure

```text
paymesh/
├── app/
│   ├── main.py
│   ├── database.py
│   ├── models/
│   ├── routes/
│   ├── schemas/
│   └── services/
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── tests/
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
└── requirements.txt
```

## Prerequisites

- Python 3.10+
- Node.js and npm
- Docker Desktop
- Git

## Setup on Windows

### 1. Clone the repository

Replace `YOUR_USERNAME` with your GitHub username.

```powershell
git clone https://github.com/YOUR_USERNAME/paymesh-payment-platform.git
cd paymesh-payment-platform
```

### 2. Configure environment variables

Copy `.env.example` to `.env` in the project root, then edit `.env` with your own local credentials.

Example:

```env
POSTGRES_USER=paymesh_user
POSTGRES_PASSWORD=change_this_local_password
POSTGRES_DB=paymesh
DATABASE_URL=postgresql://paymesh_user:change_this_local_password@db:5432/paymesh
```

Never commit `.env` or real credentials to GitHub. The `.env.example` file should contain placeholders only.

### 3. Start the backend and database

From the project root:

```powershell
docker compose up -d --build
```

Check the containers:

```powershell
docker compose ps
```

### 4. Open the API documentation

Visit:

```text
http://localhost:8000/docs
```

The Swagger UI page lists the API routes and allows you to send test requests.

### 5. Start the frontend

Open a second terminal in the project root:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, commonly:

```text
http://localhost:5173
```

## Running Tests

From the project root, activate your Python virtual environment if you use one, install the dependencies, then run:

```powershell
pytest -v
```

## API Overview

The current backend includes account and payment routes. Common route groups include:

- `/accounts/` — account operations
- `/payments/` — payment operations
- `/docs` — interactive API documentation
- `/openapi.json` — OpenAPI schema

Use `/docs` to confirm the exact methods, request fields, and response schemas exposed by your current version.

## Engineering Concepts

- REST API design
- Relational data modelling
- SQLAlchemy ORM
- Payment transaction workflows
- Idempotent request handling
- Account balance updates
- Ledger records
- Frontend/backend integration
- Containerized local development

## Limitations

PayMesh is an educational software engineering project, not a production payment gateway. It should not be used to process real financial transactions. Authentication, authorization, production-grade secrets management, concurrency hardening, reconciliation, monitoring, and extensive failure testing may be needed before any real-world deployment.

## Author

**Name:** YOUR NAME  
**GitHub:** https://github.com/YOUR_USERNAME
