# ✍️ BlogSphere — Full-Stack Blogging Platform

> A modern, production-ready blogging platform built with **Django REST Framework** (backend) and **React + Vite** (frontend), backed by **MySQL** and secured with **JWT authentication**.

---

## 📑 Table of Contents

1. [Project Overview](#-project-overview)
2. [Tech Stack](#-tech-stack)
3. [Project Structure](#-project-structure)
4. [Features](#-features)
5. [Getting Started](#-getting-started)
   - [Prerequisites](#prerequisites)
   - [Backend Setup (Django)](#backend-setup-django)
   - [Frontend Setup (React)](#frontend-setup-react)
6. [Running the Application](#-running-the-application)
7. [API Reference](#-api-reference)
8. [Environment Variables](#-environment-variables)
9. [User Roles](#-user-roles)
10. [How It Works](#-how-it-works)

---

## 🌐 Project Overview

**BlogSphere** is a full-stack blogging platform where users can:

- Register and log in securely using **JWT tokens**
- Write, edit, and delete blog posts with optional **cover images**
- Browse all posts with **search** and **category filtering**
- **Like** posts and leave **comments**
- Manage their own profile (bio, profile picture)

The project is split into two separate servers that communicate via REST API:

| Layer    | Technology            | Port  |
|----------|-----------------------|-------|
| Backend  | Django + DRF + MySQL  | 8000  |
| Frontend | React + Vite          | 5173  |

---

## 🛠 Tech Stack

### Backend
| Package                       | Purpose                              |
|-------------------------------|--------------------------------------|
| Django 4.2                    | Web framework                        |
| Django REST Framework 3.14    | REST API toolkit                     |
| djangorestframework-simplejwt | JWT access + refresh token auth      |
| django-cors-headers           | Allow React dev server to call API   |
| mysqlclient                   | MySQL database driver                |
| Pillow                        | Image upload processing              |
| python-decouple               | Environment variable management      |

### Frontend
| Package          | Purpose                          |
|------------------|----------------------------------|
| React 18         | UI framework                     |
| Vite 8           | Dev server and build tool        |
| React Router DOM | Client-side routing              |
| Axios            | HTTP requests to Django API      |

---

## 📁 Project Structure

```
blogging-platform/
│
├── blogproject/              # Django project configuration
│   ├── settings.py           # All app settings (DB, JWT, CORS, media)
│   ├── urls.py               # Root URL config — mounts /api/ and /admin/
│   └── wsgi.py
│
├── blog/                     # Main Django app
│   ├── models.py             # User, Post, Category, Comment models
│   ├── serializers.py        # DRF serializers (with absolute media URLs)
│   ├── views.py              # API views (CRUD, like, comment, profile)
│   ├── urls.py               # /api/ endpoint definitions
│   ├── permissions.py        # IsAuthorOrReadOnly custom permission
│   ├── admin.py              # Django admin panel registration
│   └── migrations/           # Database migration files
│
├── media/                    # User-uploaded files (git-ignored)
│   ├── cover_images/         # Post cover images
│   └── profile_pics/         # User profile pictures
│
├── frontend/                 # React + Vite frontend
│   ├── index.html            # Vite entry point
│   ├── package.json
│   └── src/
│       ├── main.jsx          # React app entry
│       ├── App.jsx           # Router + route definitions
│       ├── index.css         # Global design system (dark theme)
│       │
│       ├── api/
│       │   └── axios.js      # Axios instance with JWT interceptors
│       │
│       ├── context/
│       │   └── AuthContext.jsx  # Global auth state (login, logout, user)
│       │
│       ├── components/
│       │   ├── Navbar.jsx         # Top navigation bar
│       │   ├── PostCard.jsx       # Post summary card for grid view
│       │   ├── CommentSection.jsx # Comment list + add comment form
│       │   └── ProtectedRoute.jsx # Redirects unauthenticated users
│       │
│       └── pages/
│           ├── Home.jsx       # Post grid, search, category filter
│           ├── PostDetail.jsx # Full post view, like, comment, edit/delete
│           ├── CreatePost.jsx # Create new post & Edit existing post
│           ├── MyPosts.jsx    # Current user's posts dashboard
│           ├── Profile.jsx    # View & update profile
│           ├── Login.jsx      # JWT login form
│           └── Register.jsx   # User registration form
│
├── index.html                # Splash page (links to app, admin, API)
├── manage.py                 # Django management script
├── requirements.txt          # Python dependencies
├── .env                      # Secret config (git-ignored)
├── .gitignore
└── README.md
```

---

## ✨ Features

### 🔐 Authentication
- JWT-based login with **Access Token** (1 hour) + **Refresh Token** (7 days)
- Automatic silent token refresh via Axios interceptor
- Protected routes — unauthenticated users are redirected to `/login`

### 📝 Posts
- Create posts with **title**, **content**, **category**, **tags**, and optional **cover image**
- Cover images stored in `media/cover_images/` and served via Django
- Edit and delete your own posts (author-only permission enforced on backend)
- Full text search across title, content, author, and tags
- Filter posts by category

### 💬 Engagement
- **Like / Unlike** toggle on each post (one like per user, live count)
- **Comments** — add comments to any post (authenticated users only)

### 👤 Profile
- View your profile (bio, role, profile picture)
- Update bio and upload a profile picture

### 🛡️ Admin
- Full Django Admin panel at `/admin/`
- Manage users, posts, categories, and comments

---

## 🚀 Getting Started

### Prerequisites

Make sure the following are installed on your machine:

- **Python 3.10+** — [python.org](https://www.python.org)
- **Node.js 18+** — [nodejs.org](https://nodejs.org)
- **MySQL 8.0+** — [mysql.com](https://mysql.com) (running locally)
- **Git** — [git-scm.com](https://git-scm.com)

---

### Backend Setup (Django)

#### 1. Clone the repository

```bash
git clone <your-repo-url>
cd blogging-platform
```

#### 2. Create and activate a virtual environment

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate
```

#### 3. Install Python dependencies

```bash
pip install -r requirements.txt
```

#### 4. Set up the MySQL database

Open MySQL and run:

```sql
CREATE DATABASE blogging_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'blog_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON blogging_db.* TO 'blog_user'@'localhost';
FLUSH PRIVILEGES;
```

#### 5. Configure environment variables

Create a `.env` file in the project root:

```env
SECRET_KEY=your-django-secret-key-here
DEBUG=True
DB_NAME=blogging_db
DB_USER=blog_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306
```

> **Tip:** Generate a Django secret key with:
> ```bash
> python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
> ```

#### 6. Run database migrations

```bash
python manage.py migrate
```

#### 7. Create a superuser (for Django Admin)

```bash
python manage.py createsuperuser
```

---

### Frontend Setup (React)

#### 1. Navigate to the frontend directory

```bash
cd frontend
```

#### 2. Install Node dependencies

```bash
npm install
```

---

## ▶️ Running the Application

You need **two terminal windows** — one for the backend, one for the frontend.

### Terminal 1 — Django Backend

```bash
# From the project root (blogging-platform/)
# Make sure your venv is activated
python manage.py runserver
```

✅ Backend running at: **http://localhost:8000**

### Terminal 2 — React Frontend

```bash
# From the frontend/ directory
npm run dev
```

✅ Frontend running at: **http://localhost:5173**

---

### Access Points

| URL                              | Description                    |
|----------------------------------|--------------------------------|
| http://localhost:5173            | React App (main interface)     |
| http://localhost:8000/admin/     | Django Admin Panel             |
| http://localhost:8000/api/posts/ | Browse API (DRF web interface) |

---

## 🔌 API Reference

All endpoints are prefixed with `/api/`.

### Auth Endpoints

| Method | Endpoint        | Description                      | Auth Required |
|--------|-----------------|----------------------------------|---------------|
| POST   | `/api/register/`| Create a new user account        | ❌            |
| POST   | `/api/login/`   | Get access + refresh JWT tokens  | ❌            |
| POST   | `/api/refresh/` | Exchange refresh token for new access token | ❌ |

**Login response example:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### Posts Endpoints

| Method | Endpoint               | Description                        | Auth Required |
|--------|------------------------|------------------------------------|---------------|
| GET    | `/api/posts/`          | List all posts                     | ❌            |
| POST   | `/api/posts/`          | Create a new post                  | ✅            |
| GET    | `/api/posts/<id>/`     | Get a single post's details        | ❌            |
| PUT    | `/api/posts/<id>/`     | Update a post (author only)        | ✅            |
| DELETE | `/api/posts/<id>/`     | Delete a post (author only)        | ✅            |
| POST   | `/api/posts/<id>/like/`| Toggle like on a post              | ✅            |
| POST   | `/api/posts/<id>/comment/` | Add a comment to a post        | ✅            |

**Query parameters for `GET /api/posts/`:**

| Param       | Example                     | Description                  |
|-------------|-----------------------------|------------------------------|
| `search`    | `?search=python`            | Search title, content, tags  |
| `category`  | `?category=technology`      | Filter by category slug      |
| `ordering`  | `?ordering=-created_at`     | Sort (default: newest first) |

### User Endpoints

| Method | Endpoint          | Description                      | Auth Required |
|--------|-------------------|----------------------------------|---------------|
| GET    | `/api/my-posts/`  | Get posts by the logged-in user  | ✅            |
| GET    | `/api/profile/`   | Get current user's profile       | ✅            |
| PUT    | `/api/profile/`   | Update bio or profile picture    | ✅            |

### Category Endpoints

| Method | Endpoint           | Description                | Auth Required |
|--------|--------------------|----------------------------|---------------|
| GET    | `/api/categories/` | List all categories        | ❌            |
| POST   | `/api/categories/` | Create a category          | ✅            |

---

## ⚙️ Environment Variables

The `.env` file is **not committed to Git**. You must create it manually.

| Variable     | Description                         | Example                        |
|--------------|-------------------------------------|--------------------------------|
| `SECRET_KEY` | Django cryptographic secret key     | `django-insecure-abc123...`    |
| `DEBUG`      | Enable debug mode (`True`/`False`)  | `True`                         |
| `DB_NAME`    | MySQL database name                 | `blogging_db`                  |
| `DB_USER`    | MySQL username                      | `blog_user`                    |
| `DB_PASSWORD`| MySQL password                      | `your_secure_password`         |
| `DB_HOST`    | MySQL host                          | `localhost`                    |
| `DB_PORT`    | MySQL port                          | `3306`                         |

---

## 👥 User Roles

| Role     | Permissions                                                        |
|----------|--------------------------------------------------------------------|
| `user`   | Read posts, like, comment (default role on registration)           |
| `author` | All user permissions + create, edit, delete **their own** posts    |
| `admin`  | Full access — managed via Django Admin panel                       |

> **To create an author account:** Register normally, then have an admin update the role to `author` via the Django Admin at `/admin/`.

---

## ⚡ How It Works

### Authentication Flow

```
User submits login form
      │
      ▼
POST /api/login/ → Django returns { access, refresh }
      │
      ▼
Tokens stored in localStorage
      │
      ▼
Every API request → Axios interceptor adds:
  Authorization: Bearer <access_token>
      │
      ▼
If 401 received → Interceptor silently calls /api/refresh/
  → stores new access token → retries original request
      │
      ▼
If refresh also fails → localStorage cleared → redirect to /login
```

### Cover Image Upload Flow

```
User selects image in CreatePost form
      │
      ▼
JavaScript builds FormData (multipart/form-data)
      │
      ▼
POST /api/posts/ with cover_image file
      │
      ▼
Django saves file to media/cover_images/
      │
      ▼
Serializer returns absolute URL:
  http://localhost:8000/media/cover_images/filename.jpg
      │
      ▼
React renders <img src={post.cover_image} />
```

### API Security

- All write operations (POST, PUT, DELETE) require a valid JWT **Bearer token**
- Post update/delete is double-guarded: `IsAuthenticatedOrReadOnly` + `IsAuthorOrReadOnly`
- CORS is configured to only allow requests from `localhost:5173` and `localhost:5174`

---

## 📄 License

This project is built for educational and portfolio purposes.
