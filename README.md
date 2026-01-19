# 🛒 Online Grocery Web App

> **Multi-store E-commerce Platform dengan Location-Based Service & Advanced Inventory Management**

Platform e-commerce grocery online yang memungkinkan user berbelanja dari toko terdekat dengan fitur manajemen multi-store, discount system yang fleksibel, dan comprehensive reporting.

---

## 🌟 Key Features

### 🏪 **Multi-Store Management**
- Location-based store selection menggunakan geolocation
- Automatic nearest store recommendation
- Per-store inventory & pricing management
- Store-specific admin access control

### 👥 **User Management**
- **User Registration & Authentication** (Email & Social Login)
- Email verification dengan set password
- Reset password functionality
- User profile management dengan avatar upload
- Multiple shipping addresses

### 📦 **Product & Inventory**
- Complete product CRUD dengan multiple images
- Product variants (size, color, etc.)
- Category management
- **Stock Journal System** - Complete audit trail untuk setiap perubahan stock
- Multi-store stock tracking
- Real-time stock availability

### 💰 **Advanced Discount System**
- **3 Discount Types:**
  - Direct Product Discount (% atau nominal)
  - Minimum Purchase Discount dengan max limit
  - Buy 1 Get 1 (BOGO)
- Voucher system dengan expiry date
- Referral code rewards
- Free shipping vouchers

### 🛍️ **Shopping & Checkout**
- Shopping cart management
- Location-based shipping cost calculation (RajaOngkir API)
- Multiple payment methods (Manual Transfer & Payment Gateway)
- Order tracking dengan multiple status
- Automatic order confirmation

### 📊 **Reporting & Analytics**
- **Sales Reports:** Monthly, by category, by product
- **Stock Reports:** Movement summary & detailed history
- Role-based report access (Super Admin vs Store Admin)
- Export functionality

### 🔐 **Role-Based Access Control (RBAC)**
- **Super Admin:** Full system access
- **Store Admin:** Store-specific access
- **User/Customer:** Shopping & order management

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **UI Library:** ShadcnUI + Radix UI
- **Styling:** TailwindCSS v4
- **State Management:** Zustand
- **Form Handling:** React Hook Form + Zod
- **Maps:** Leaflet + MapLibre GL

### **Backend**
- **Framework:** Express.js
- **Language:** TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL (Supabase)
- **Authentication:** JWT + bcrypt
- **File Upload:** Multer + Cloudinary
- **Email:** Nodemailer
- **Validation:** Zod

### **External Services**
- **Image Storage:** Cloudinary
- **Database Hosting:** Supabase
- **Shipping API:** RajaOngkir
- **Geolocation:** OpenCage / Browser Geolocation API

---

## 📁 Project Structure

```
Finpro/
├── Final_Project_Backend/      # Express.js API
│   ├── src/
│   │   ├── controllers/        # Route handlers
│   │   ├── services/           # Business logic
│   │   ├── middlewares/        # Auth & validation
│   │   ├── routers/            # API routes
│   │   └── validators/         # Zod schemas
│   └── prisma/                 # Database schema & migrations
│
├── Final_Project_Frontend/     # Next.js App
│   └── src/
│       ├── app/                # Pages (App Router)
│       │   ├── admin/          # Admin dashboard
│       │   ├── browse/         # Product catalog
│       │   ├── cart/           # Shopping cart
│       │   └── checkout/       # Checkout flow
│       ├── components/         # Reusable components
│       ├── hooks/              # Custom hooks
│       └── lib/                # Utilities & API clients
│
└── Presentasi/                 # Presentation materials
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Cloudinary account
- RajaOngkir API key (optional)

### Installation

**1. Clone repository**
```bash
git clone <repository-url>
cd Finpro
```

**2. Backend Setup**
```bash
cd Final_Project_Backend
npm install
cp .env.example .env
# Configure .env dengan database & API keys
npx prisma generate
npx prisma db push
npm run dev
```

**3. Frontend Setup**
```bash
cd Final_Project_Frontend
npm install
cp .env.local.example .env.local
# Configure .env.local dengan backend URL
npm run dev
```
 
 

## 🎯 Unique Selling Points

1. **Location-Based Shopping** - Automatic store selection berdasarkan lokasi user
2. **Stock Journal System** - Complete audit trail untuk inventory management
3. **Flexible Discount Engine** - 3 tipe discount dengan berbagai conditions
4. **Multi-Store Architecture** - Scalable untuk multiple locations
5. **Comprehensive Reporting** - Sales & stock analytics dengan role-based access
6. **Mobile-First Design** - Responsive UI untuk semua devices

---

## 👥 Team

**Group 1 - JCWDBDGAM-09**
- Member 1: Feature 1 (User & Store Management)
- Member 2: Feature 2 (Admin & Product Management)
- Member 3: Feature 3 (Order & Checkout)

---

## 📄 License

This project is developed as a final project for Purwadhika Bootcamp.

---

## 🙏 Acknowledgments

- Purwadhika Digital Technology School
- Mentors & Instructors 
- Cloudinary
- Supabase
