from rest_framework import serializers
from .models import User, Tweet, TweetLike, UserFollower

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'display_name', 'email', 'password', 'verified', 'photo', 'header_photo', 'bio', 'birth_date', 'location', 'website', 'date_joined')
        extra_kwargs = {'password': {'write_only': True}}

class TweetUserSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Tweet
        fields = ('id', 'user', 'text', 'image', 'created_at', 'updated_at')

class TweetWithoutUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tweet
        fields = ('id', 'text', 'image', 'created_at', 'updated_at')

class TweetLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TweetLike
        fields = ('id', 'user', 'tweet', 'created_at')

class TweetLikeWithoutUserSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        tweet_like, created = TweetLike.objects.get_or_create(**validated_data)
        return tweet_like

    class Meta:
        model = TweetLike
        fields = ('id', 'tweet', 'created_at')

class UserFollowerSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFollower
        fields = ('id', 'user', 'follower', 'created_at')