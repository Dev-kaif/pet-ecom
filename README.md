# Pet-Ecom 🐾

**Your one-stop shop for pet supplies**

Pet-Ecom is a full-featured e-commerce platform built with **Next.js**, **TypeScript**, and **MongoDB**. It provides a smooth and complete online shopping experience tailored for pet owners—covering everything from browsing products to secure checkout. The app also includes an admin dashboard to manage products, users, orders, and more.

---

## 🚀 Features

### 🛒 User-Facing

* **Product browsing & filtering**: Find items by category, price, and other filters.
* **Shopping cart & wishlist**: Add products to cart or save them for later.
* **Secure checkout**: Multi-step process for shipping and payment.
* **User profiles**: Manage orders, addresses, and personal info.
* **Pet adoption**: Browse adoptable pets with full details.
* **Reservations**: Book appointments for pet-related services.

### ⚙️ Admin Panel

* **Dashboard**: Overview of sales, orders, and user activity.
* **Product management**: Add, edit, or remove products with images, pricing, and inventory.
* **Order management**: View and update order statuses, payments, and shipping.
* **User management**: Manage customer accounts and roles.
* **Gallery management**: Control the image gallery section.
* **Team management**: Update the team section on the about page.

---

## 🛠 Tech Stack

* **Frontend**: Next.js, React, TypeScript, Tailwind CSS
* **Backend**: Next.js API Routes, MongoDB, Mongoose
* **Auth**: NextAuth.js

---

## ⚙️ Getting Started

### Prerequisites

* Node.js (v18.x or higher)
* MongoDB instance (local or cloud)

### Installation

Clone the repository:

```bash
git clone https://github.com/Dev-kaif/pet-ecom.git
```

Install dependencies:

```bash
cd pet-ecom
npm install
```

Set up environment variables:

Create a `.env.local` file in the root directory:

```
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

Start the development server:

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---
