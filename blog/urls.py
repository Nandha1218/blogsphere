from django.urls import path
from .views import (
    RegisterView, PostListCreateView, PostDetailView,
    MyPostsView, CategoryListView, UserProfileView,
    add_comment, like_post, GoogleLogin
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

# ─── API URL Patterns ─────────────────────────────────────────────────────────
#
# Base: /api/
#
# Auth
#   POST  register/           → create a new user account
#   POST  login/              → get access + refresh JWT tokens
#   POST  refresh/            → exchange refresh token for new access token
#   POST  auth/google/        → google login
#
# Posts
#   GET   posts/              → list all posts  (supports ?search= ?category=)
#   POST  posts/              → create a post   (authenticated)
#   GET   posts/<id>/         → post detail
#   PUT   posts/<id>/         → edit post       (author only)
#   DELETE posts/<id>/        → delete post     (author only)
#   POST  posts/<id>/comment/ → add comment     (authenticated)
#   POST  posts/<id>/like/    → toggle like     (authenticated)
#
# User
#   GET   my-posts/           → current user's posts (authenticated)
#   GET   profile/            → current user profile
#   PUT   profile/            → update profile
#
# Misc
#   GET   categories/         → list all categories
#   POST  categories/         → create category (authenticated)

urlpatterns = [
    # Auth
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('auth/google/', GoogleLogin.as_view(), name='google_login'),

    # Posts
    path('posts/', PostListCreateView.as_view(), name='posts'),
    path('posts/<int:pk>/', PostDetailView.as_view(), name='post-detail'),
    path('posts/<int:pk>/comment/', add_comment, name='add-comment'),
    path('posts/<int:pk>/like/', like_post, name='like-post'),

    # User-specific
    path('my-posts/', MyPostsView.as_view(), name='my-posts'),
    path('profile/', UserProfileView.as_view(), name='profile'),

    # Categories
    path('categories/', CategoryListView.as_view(), name='categories'),
]