from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User, Post, Comment, Category


# ─── User Serializers ─────────────────────────────────────────────────────────

class UserSerializer(serializers.ModelSerializer):
    """Public user info returned inside posts and comments."""
    profile_pic = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'bio', 'profile_pic']

    def get_profile_pic(self, obj):
        """Return absolute URL for profile picture, or None if not set."""
        if obj.profile_pic:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_pic.url)
            return obj.profile_pic.url
        return None


class RegisterSerializer(serializers.ModelSerializer):
    """
    User registration serializer.
    Password is write-only and validated using Django's built-in validators.
    """
    password = serializers.CharField(
        write_only=True, required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role']
        extra_kwargs = {
            'email': {'required': True},
        }

    def create(self, validated_data):
        # create_user handles password hashing automatically
        return User.objects.create_user(**validated_data)


# ─── Category Serializer ──────────────────────────────────────────────────────

class CategorySerializer(serializers.ModelSerializer):
    """Serializes blog post categories with name and URL slug."""
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']


# ─── Comment Serializer ───────────────────────────────────────────────────────

class CommentSerializer(serializers.ModelSerializer):
    """
    Serializes a comment with full nested user info.
    User field is read-only — set automatically from request.user in the view.
    """
    user = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'user', 'content', 'created_at']


# ─── Post Serializer ──────────────────────────────────────────────────────────

class PostSerializer(serializers.ModelSerializer):
    """
    Full post serializer:
    - author        : nested read-only user object
    - category      : nested read-only category (use category_id to set on create/update)
    - comments      : all nested comments (read-only)
    - total_likes   : computed count of likes
    - is_liked      : True if the currently authenticated user has liked this post
    - cover_image   : returns absolute URL so the frontend can use it directly
    """
    author = UserSerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)
    total_likes = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()

    # Read-only: returns absolute URL for the cover image
    cover_image_url = serializers.SerializerMethodField()

    # Write-only: accepts file uploads for cover image
    cover_image = serializers.ImageField(
        write_only=True, required=False, allow_null=True
    )

    # Write-only field so clients can send category_id on create/update
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True,
        required=False,
        allow_null=True
    )

    class Meta:
        model = Post
        fields = [
            'id', 'title', 'content', 'author',
            'category', 'category_id',
            'tags', 'cover_image', 'cover_image_url',
            'created_at', 'updated_at',
            'comments', 'total_likes', 'is_liked'
        ]

    def get_cover_image_url(self, obj):
        """Return absolute URL for cover image, or None if not set."""
        if obj.cover_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.cover_image.url)
            return obj.cover_image.url
        return None

    def get_total_likes(self, obj):
        return obj.likes.count()

    def get_is_liked(self, obj):
        """Returns True if the authenticated request user has liked this post."""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return request.user in obj.likes.all()
        return False