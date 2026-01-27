# MarketLink - Online Marketing Platform

**MarketLink** is a comprehensive e-commerce marketplace platform that connects buyers and sellers. It features user authentication, product management, order processing, and an interactive dashboard for both sellers and administrators.

## Group Members

| No  | Name            | ID No   |
| --- | --------------- | ------- |
| 1   | Mitiku Etafa    | 1501463 |
| 2   | Kebede Delelegn | 1501322 |
| 3   | Lelisa Temesgen | 1501359 |
| 4   | Abdi Abiot      | 1500744 |
| 5   | Adnen Jemal     | 1500821 |
| 6   | Abdulber Rejeb  | 1500757 |

---

## API Documentation

The backend API is designed to handle all platform operations securely and efficiently. Below is a detailed reference of the available endpoints.

### 🔐 Authentication & Users

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user account | Public |
| `POST` | `/api/auth/login` | Log in and receive a JWT token | Public |
| `POST` | `/api/auth/google` | Authenticate using Google OAuth | Public |
| `GET` | `/api/auth/profile` | Get logged-in user's profile | Private |
| `PUT` | `/api/auth/profile` | Update logged-in user's profile | Private |
| `POST` | `/api/auth/switch-to-seller` | Upgrade user account to Seller account | Private |
| `POST` | `/api/auth/forgot-password` | Request a password reset code via email | Public |
| `POST` | `/api/auth/verify-reset-code` | Verify the password reset code | Public |
| `POST` | `/api/auth/reset-password` | Set a new password | Public |
| `GET` | `/api/auth/users` | Get a list of all users | Admin |
| `PUT` | `/api/auth/users/:id` | Update a user's role | Admin |
| `DELETE` | `/api/auth/users/:id` | Delete a specific user | Admin |

### 📦 Products & Categories

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Get list of all products | Public |
| `GET` | `/api/products/:id` | Get details of a single product | Public |
| `POST` | `/api/products` | Create a new product | Seller / Admin |
| `PUT` | `/api/products/:id` | Update an existing product | Seller / Admin |
| `DELETE` | `/api/products/:id` | Delete a product | Seller / Admin |
| `GET` | `/api/products/seller` | Get products belonging to the logged-in seller | Seller |
| `GET` | `/api/products/categories` | Get all product categories | Public |
| `POST` | `/api/products/categories` | Create a new category | Seller / Admin |
| `PUT` | `/api/products/categories/:id` | Update a category name | Seller / Admin |
| `DELETE` | `/api/products/categories/:id` | Delete a category | Admin |

### 🛒 Orders

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Create a new order | Private |
| `GET` | `/api/orders/myorders` | Get order history for logged-in user | Private |
| `GET` | `/api/orders/:id` | Get specific order details | Private |
| `GET` | `/api/orders/seller` | Get orders for products sold by the seller | Seller |
| `GET` | `/api/orders/seller/stats` | Get sales statistics for seller dashboard | Seller |
| `GET` | `/api/orders/admin/stats` | Get platform-wide sales statistics | Admin |

### 📤 Uploads & Utilities

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/upload` | Upload an image file (for products/profiles) | Public |
| `POST` | `/api/newsletter/subscribe` | Subscribe email to the newsletter | Public |

### 🛠️ Setup & Usage

**Prerequisites:**
- Node.js & npm
- MySQL
- Google Cloud Console Project (for OAuth)

**Environment Variables:**
Create a `.env` file in the `backend` directory with the following:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=marketlink_db
GOOGLE_CLIENT_ID=your_google_client_id
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

**Running the Server:**
```bash
cd backend
npm install
npm start
```
The API serves at `http://localhost:5000`.
Swagger docs available at `http://localhost:5000/api-docs`.
