# Deployment Guide for MarketLink

This guide explains how to deploy the MarketLink platform (Frontend & Backend) for free.

## 1. Database (MySQL)
Since this project uses MySQL, you need a hosted MySQL instance.
*   **Recommended**: [Aiven](https://aiven.io/mysql) (Free Tier available) or [Tidb Cloud](https://www.pingcap.com/tidb-cloud/).
*   **Steps**:
    1. Create an account on Aiven.
    2. Create a new MySQL service (choose the "Free" plan).
    3. Copy the Connection Details (Host, Port, User, Password, Database Name).
    4. Run your database initialization scripts (like `backend/seed.js` or `backend/init-orders-db.js`) against the new database to set up the tables.

## 2. Backend (Node.js)
Deploy the backend to [Render](https://render.com/).
*   **Steps**:
    1. Connect your GitHub repository to Render.
    2. Create a new **Web Service**.
    3. Set the **Root Directory** to `backend`.
    4. Build Command: `npm install`
    5. Start Command: `node server.js`
    6. Add the following **Environment Variables**:
        * `PORT`: `5000`
        * `DB_HOST`: (From Aiven)
        * `DB_USER`: (From Aiven)
        * `DB_PASSWORD`: (From Aiven)
        * `DB_NAME`: (From Aiven)
        * `JWT_SECRET`: (Your secret key)
        * `FRONTEND_URL`: (The URL from Vercel after you deploy the frontend)
        * `BACKEND_URL`: (The URL Render provides for this service)
        * `EMAIL_USER`: (Your email)
        * `EMAIL_PASS`: (Your email app password)

## 3. Frontend (React/Vite)
Deploy the frontend to [Vercel](https://vercel.com/).
*   **Steps**:
    1. Connect your GitHub repository to Vercel.
    2. Select the repository and set the **Root Directory** to `market-place`.
    3. Vercel should automatically detect **Vite** settings.
    4. Add the following **Environment Variable**:
        * `VITE_API_URL`: `https://your-backend-render-url.onrender.com/api`
    5. Click **Deploy**.

## Important Notes
*   **CORS**: The backend is currently configured to allow all origins (`app.use(cors())`). In production, you might want to restrict this to your frontend URL.
*   **Uploads**: Images uploaded via the platform are stored locally in the `backend/uploads` folder. On Render's free tier, these will be deleted whenever the server restarts. For permanent storage, consider using [Cloudinary](https://cloudinary.com/).
