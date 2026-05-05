from django.contrib import admin
from .models import User, Post, Comment, Category


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    """Admin panel view for managing user accounts."""
    list_display = ['id', 'username', 'email', 'role', 'is_active', 'date_joined']
    list_filter = ['role', 'is_active']
    search_fields = ['username', 'email']


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """Admin panel view for blog categories."""
    list_display = ['id', 'name', 'slug']
    prepopulated_fields = {'slug': ('name',)}  # Auto-fills slug from name


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    """Admin panel view for blog posts."""
    list_display = ['id', 'title', 'author', 'category', 'created_at', 'total_likes']
    list_filter = ['created_at', 'category']
    search_fields = ['title', 'author__username', 'tags']

    def total_likes(self, obj):
        return obj.likes.count()
    total_likes.short_description = 'Likes'


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    """Admin panel view for post comments."""
    list_display = ['id', 'post', 'user', 'content', 'created_at']
    search_fields = ['user__username', 'post__title']
