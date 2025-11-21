# Project Overview
## MajiTrack
MajiTrack is a MERN stack application for tracking water consumption readings.

b) Features

Add readings

Delete readings

View reports

Responsive frontend

c) Deployment Instructions
## Setup

1. Clone the repo
   ```bash
   git clone https://github.com/YourUsername/MajiTrack.git
   cd MajiTrack
    ```

Install dependencies

Backend:
```bash
cd backend
npm install
```

Frontend:
```bash
cd ../frontend
npm install
```

Configure environment variables

Copy .env.example to .env and add your MongoDB URI.

Run locally

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

Deployed Applications

Frontend: https://maji-track-indol.vercel.app/

Backend API: https://majitrack.onrender.com


#### d) CI/CD (GitHub Actions)

## CI/CD Pipeline
- Workflow file: `.github/workflows/deploy.yml`
- Runs on every push to `main`
- Installs dependencies, builds the frontend, deploys backend/frontend
- (Pipeline will be improved after submission)
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/27e06b02-b157-4a11-9eba-8ffc449b87d7" />

e) Monitoring & Notes
## Monitoring & Maintenance
- Future implementation: uptime monitoring and error tracking (e.g., Sentry)
- Regular MongoDB backups recommended
