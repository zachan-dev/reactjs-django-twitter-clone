from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    display_name = models.CharField(max_length=255)
    verified = models.BooleanField(default=False)
    photo = models.URLField(blank=True)
    header_photo = models.URLField(blank=True)
    website = models.URLField(blank=True)
    bio = models.CharField(max_length=160, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    location = models.CharField(max_length=30, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    pass

class Tweet(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.CharField(max_length=280)
    image = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class TweetLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='like_set')
    tweet = models.ForeignKey(Tweet, on_delete=models.CASCADE, related_name='like_set')
    created_at = models.DateTimeField(auto_now_add=True)

class UserFollower(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name='follower')
    created_at = models.DateTimeField(auto_now_add=True)

