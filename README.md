# Zomato Clone - Full Stack MERN Application

A feature-rich food delivery platform with role-based dashboards for Customers, Restaurant Owners, Delivery Partners, and Admins.

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion, Lucide React
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Tokens)
- **Image Storage**: Cloudinary (for menu items and restaurant photos)
- **Payments**: Razorpay (COD integration for this demo)

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB Atlas account or local MongoDB instance
- Cloudinary account (optional, for image uploads)

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:5173
```

Create a `.env.local` or `.env.production` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### Installation

1. **Backend**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Accounts for Testing

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@zomato.com` | `admin123` |
| **Restaurant Owner** | `owner@pizza.com` | `owner123` |
| **Delivery Partner** | `delivery@zomato.com` | `delivery123` |
| **Customer** | `customer@zomato.com` | `customer@123` |

## Deployment Instructions

### Backend (Render)
1. Connect your GitHub repository to Render.
2. Build Command: `npm install`
3. Start Command: `npm start`
4. Add all environment variables from your `.env` file.

### Frontend (Vercel)
1. Connect your repository to Vercel.
2. Framework Preset: `Vite`
3. Root Directory: `frontend`
4. Environment Variables: Set `VITE_API_URL` to your Render backend URL (e.g., `https://your-api.onrender.com/api`).

---
*Created with ❤️ by Antigravity*
