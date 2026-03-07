# 📝 Blogging Platform with Comments & Likes

A Django REST Framework backend for a blogging platform where users can create blogs, comment, like posts, and manage profiles with role-based access.

## 🚀 Features

- JWT-based Authentication (Register, Login, Token Refresh)
- Role-based Access Control (Admin, Author, User)
- Create, Read, Update, Delete Blog Posts
- Comment on Posts
- Like / Unlike Posts
- Django Admin Panel with full model management

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Django 5.x + Django REST Framework |
| Auth | djangorestframework-simplejwt |
| Database | MySQL |
| Config | python-decouple (.env) |

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd blogging-platform
```

### 2. Create Virtual Environment
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Create MySQL Database
Run these in MySQL Workbench or MySQL CLI:
```sql
CREATE DATABASE blogging_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'blog_user'@'localhost' IDENTIFIED BY 'yourpassword';
GRANT ALL PRIVILEGES ON blogging_db.* TO 'blog_user'@'localhost';
FLUSH PRIVILEGES;
```

### 5. Create `.env` File
Create a `.env` file in the root directory:
```
SECRET_KEY=your-django-secret-key
DB_NAME=blogging_db
DB_USER=blog_user
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=3306
```

### 6. Run Migrations
```bash
python manage.py migrate
```

### 7. Create Superuser (Admin Panel Access)
```bash
python manage.py createsuperuser
```

### 8. Run the Server
```bash
python manage.py runserver
```

Server runs at: `http://127.0.0.1:8000/`

## 📡 API Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/register/` | Register a new user | ❌ |
| POST | `/api/login/` | Get JWT access token | ❌ |
| POST | `/api/refresh/` | Refresh JWT token | ❌ |
| GET | `/api/posts/` | List all posts | ❌ |
| POST | `/api/posts/` | Create a new post | ✅ |
| GET | `/api/posts/<id>/` | Get a specific post | ❌ |
| PUT | `/api/posts/<id>/` | Update a post | ✅ Author only |
| DELETE | `/api/posts/<id>/` | Delete a post | ✅ Author only |
| POST | `/api/posts/<id>/comment/` | Add a comment | ✅ |
| POST | `/api/posts/<id>/like/` | Like / Unlike a post | ✅ |

## 🔐 User Roles

| Role | Permissions |
|---|---|
| admin | Full access |
| author | Create, edit, delete own posts |
| user | Read posts, like, comment |

## 🖥️ Admin Panel

Access at: `http://127.0.0.1:8000/admin/`

Login with the superuser credentials created in Step 7.

## 📁 Project Structure

```
blogging-platform/
├── manage.py
├── requirements.txt
├── .env                  ← (create this, not in repo)
├── blogproject/
│   ├── settings.py
│   └── urls.py
└── blog/
    ├── models.py         ← User, Post, Comment
    ├── serializers.py
    ├── views.py
    ├── urls.py
    ├── permissions.py
    └── admin.py
```

## 📦 Generate requirements.txt

```bash
pip freeze > requirements.txt
```
