from django.contrib import admin
from .models import User, Tweet, TweetLike, UserFollower

# Register your models here.
admin.site.register(User)
admin.site.register(Tweet)
admin.site.register(TweetLike)
admin.site.register(UserFollower)