# 🏨 QuickStay – Hotel Booking Platform

QuickStay is a full-stack hotel booking web application where users can explore hotels, check room availability, and book rooms easily.
Hotel owners can manage hotels, rooms, and bookings through an admin dashboard.

This project is built using the **MERN stack** with modern tools for authentication, image hosting, and deployment.

---

## 🌐 Live Demo

https://booking-hotel1-9snz.vercel.app/

## ✨ Features

### 👤 User Features

* Browse available hotels and rooms
* Book rooms online
* View and manage bookings
* Secure authentication with Clerk

### 🏨 Owner / Admin Features

* Owner dashboard
* Add new hotels
* Add and manage rooms
* View room listings
* Manage booking status
* Upload hotel and room images

### ⚙️ Platform Features

* Full authentication using Clerk
* Image upload system
* API-based architecture
* Responsive modern UI
* REST API backend
* Cloud-based deployment

---

## 🛠 Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* React Router

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### Services & Tools

* Clerk (Authentication)
* ImageKit (Image Hosting)
* MongoDB Atlas (Database)
* Vercel (Frontend Hosting)
* Render (Backend Hosting)
* GitHub (Version Control)

---

## 📂 Project Structure

```
Hotel_booking_project
│
├── frontend
│   ├── src
│   ├── components
│   ├── pages
│   └── assets
│
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   └── middleware
│
└── README.md
```

---

## ⚡ Installation & Setup

### 1️⃣ Clone the repository

```
git clone https://github.com/your-username/your-repo-name.git
```

### 2️⃣ Install dependencies

Frontend

```
cd frontend
npm install
```

Backend

```
cd backend
npm install
```

### 3️⃣ Setup environment variables

Create `.env` files in frontend and backend.

Example:

Backend `.env`

```
PORT=5000
MONGO_URI=your_mongodb_connection
CLERK_SECRET_KEY=your_clerk_secret
IMAGEKIT_PRIVATE_KEY=your_imagekit_key
```

Frontend `.env`

```
VITE_API_URL=your_backend_url
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
```

### 4️⃣ Run the project

Backend

```
npm run dev
```

Frontend

```
npm run dev
```

---

## 🚀 Deployment

Frontend deployed on **Vercel**
Backend deployed on **Render**
Database hosted on **MongoDB Atlas**

## 📈 Future Improvements

* Payment gateway integration
* Reviews and ratings system
* Wishlist feature
* Hotel availability calendar
* Booking analytics dashboard

---

## 👨‍💻 Author

Yash Prajapati
Frontend Developer | MERN Stack Learner

---

⭐ If you like this project, give it a star on GitHub!
