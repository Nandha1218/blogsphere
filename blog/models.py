from django.db import models
from django.contrib.auth.models import AbstractUser


# ─── Custom User ────────────────────────────────────────────────────────────
class User(AbstractUser):
    """
    Extended User model with role-based access and profile fields.
    Roles:
      - admin  : full control (managed via Django admin panel)
      - author : can create, edit, delete their own posts
      - user   : can read, like, and comment on posts
    """
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('author', 'Author'),
        ('user', 'User'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    bio = models.TextField(blank=True, null=True)
    profile_pic = models.ImageField(upload_to='profile_pics/', blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.role})"


# ─── Category ────────────────────────────────────────────────────────────────
class Category(models.Model):
    """
    Post categories (e.g. Technology, Travel, Food).
    Uses a URL-friendly slug for filtering via query params.
    """
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)

    class Meta:
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name


# ─── Post ─────────────────────────────────────────────────────────────────────
class Post(models.Model):
    """
    Core blog post model.
    - author    : linked to the User who created the post
    - category  : optional category (nullable so old posts are unaffected)
    - tags      : comma-separated string for simple tag support
    - cover_image : optional hero image for the post card
    - likes     : many-to-many so each user can like once
    """
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    title = models.CharField(max_length=255)
    content = models.TextField()
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='posts'
    )
    tags = models.CharField(
        max_length=255, blank=True,
        help_text='Comma-separated tags e.g. python,django,webdev'
    )
    cover_image = models.ImageField(upload_to='cover_images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    likes = models.ManyToManyField(User, related_name='liked_posts', blank=True)

    def __str__(self):
        return self.title


# ─── Comment ──────────────────────────────────────────────────────────────────
class Comment(models.Model):
    """
    Comments are linked to a Post and a User.
    Deleting a post cascades and removes all its comments.
    """
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} → {self.post.title}"