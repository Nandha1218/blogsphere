from django.contrib import admin
from .models import User, Post, Comment

# Register User
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['id', 'username', 'email', 'role', 'is_active', 'date_joined']
    list_filter = ['role', 'is_active']
    search_fields = ['username', 'email']

# Register Post
@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'author', 'created_at', 'updated_at']
    list_filter = ['created_at']
    search_fields = ['title', 'author__username']

# Register Comment
@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['id', 'post', 'user', 'content', 'created_at']
    search_fields = ['user__username', 'post__title']
