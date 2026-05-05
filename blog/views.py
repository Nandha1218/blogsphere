from rest_framework import generics, permissions, filters
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from .models import Post, Comment, Category
from .serializers import (
    RegisterSerializer, PostSerializer,
    CommentSerializer, CategorySerializer, UserSerializer
)
from .permissions import IsAuthorOrReadOnly
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView


# ─── Auth Views ───────────────────────────────────────────────────────────────

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = "http://localhost:5173"
    client_class = OAuth2Client

class RegisterView(generics.CreateAPIView):
    """
    POST /api/register/
    Open endpoint — creates a new user account.
    Accepts: username, email, password, role
    """
    queryset = None
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


# ─── Post Views ───────────────────────────────────────────────────────────────

class PostListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/posts/         — list all posts (public, supports ?search=&category=)
    POST /api/posts/         — create a post (authenticated only)

    Query params:
      ?search=<term>         searches title, content, author username
      ?category=<slug>       filters by category slug
      ?ordering=created_at   or -created_at (default newest first)
    """
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content', 'author__username', 'tags']
    ordering_fields = ['created_at', 'title']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = Post.objects.select_related('author', 'category').prefetch_related('comments', 'likes')
        category_slug = self.request.query_params.get('category')
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        return queryset

    def perform_create(self, serializer):
        # Automatically set the author to the currently logged-in user
        serializer.save(author=self.request.user)


class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/posts/<id>/   — retrieve post detail (public)
    PUT    /api/posts/<id>/   — update post (author only)
    DELETE /api/posts/<id>/   — delete post (author only)
    """
    queryset = Post.objects.select_related('author', 'category').prefetch_related('comments', 'likes')
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]


class MyPostsView(generics.ListAPIView):
    """
    GET /api/my-posts/
    Returns only the posts authored by the currently logged-in user.
    Used for the "My Posts" dashboard page.
    """
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Post.objects.filter(
            author=self.request.user
        ).order_by('-created_at')


# ─── Category Views ───────────────────────────────────────────────────────────

class CategoryListView(generics.ListCreateAPIView):
    """
    GET  /api/categories/   — list all categories (public)
    POST /api/categories/   — create a category (authenticated)
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


# ─── Profile Views ────────────────────────────────────────────────────────────

class UserProfileView(APIView):
    """
    GET /api/profile/   — get the logged-in user's own profile
    PUT /api/profile/   — update bio or profile_pic (partial update supported)
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user, context={'request': request})
        return Response(serializer.data)

    def put(self, request):
        serializer = UserSerializer(
            request.user, data=request.data,
            partial=True, context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


# ─── Comment & Like Views ─────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def add_comment(request, pk):
    """
    POST /api/posts/<id>/comment/
    Adds a comment to the specified post.
    Requires authentication.
    """
    post = get_object_or_404(Post, pk=pk)
    serializer = CommentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user, post=post)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def like_post(request, pk):
    """
    POST /api/posts/<id>/like/
    Toggles a like on the post for the current user.
    Returns:{'liked': True/False, 'total_likes': <count>}
    """
    post = get_object_or_404(Post, pk=pk)
    if request.user in post.likes.all():
        post.likes.remove(request.user)
        liked = False
    else:
        post.likes.add(request.user)
        liked = True
    return Response({'liked': liked, 'total_likes': post.likes.count()})