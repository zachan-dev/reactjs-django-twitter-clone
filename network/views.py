from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponseRedirect
from django.shortcuts import render, get_object_or_404
from django.urls import reverse
from django.core.exceptions import PermissionDenied
from django.core.paginator import Paginator

from .models import User, Tweet, TweetLike, UserFollower
from .serializers import (
    UserSerializer, 
    TweetUserSerializer, TweetLikeExposeTweetSerializer, TweetWithoutUserSerializer, 
    TweetLikeSerializer, TweetLikeWithoutUserSerializer, 
    UserFollowerSerializer, UserFollowerWithoutFollowerSerializer, UserFollowerExposeUserSerializer, UserFollowerExposeFollowerSerializer,
)
from .exceptions import CannotFollowSelfError, CannotActionOtherUserInfoError
from rest_framework import viewsets, mixins
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action

MAX_PAGE_LENGTH = 10

class UserAPIView(mixins.CreateModelMixin, 
                   mixins.RetrieveModelMixin,
                   mixins.ListModelMixin,
                   viewsets.GenericViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class CurrentUserView(APIView):
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    def patch(self, request):
        # print(request.data)
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        # print(serializer.initial_data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=204)
        # print(serializer.errors)
        return Response(status=400)

class UserByUsernameView(APIView):
    def get(self, request, **kwargs):
        user = get_object_or_404(User, username=kwargs['username'])
        serializer = UserSerializer(user)
        data = serializer.data
        # Users' Tweets
        tweets = Tweet.objects.filter(user=user).order_by('-created_at')

        # Users' Tweets' Pagination
        tweets_page = self.request.query_params.get('tweets_page', 1)
        tweets_paginator = Paginator(tweets, MAX_PAGE_LENGTH)
        data['tweets_pages'] = tweets_paginator.num_pages
        data['tweets'] = TweetUserSerializer(tweets_paginator.get_page(tweets_page), many=True).data

        # Users' Tweets' Likes Count and liked by user
        if isinstance(data['tweets'], list):
            for tweet in data['tweets']:
                likes_set = TweetLike.objects.filter(tweet=tweet['id'])
                tweet['likes_count'] = likes_set.count()
                likes_set = likes_set.filter(user=request.user)
                tweet['likes'] = TweetLikeSerializer(
                    likes_set,
                    many=True
                ).data

        # Users' Media
        media = tweets.exclude(image__isnull=True).exclude(image='')

        # Users' Media' Pagination
        media_page = self.request.query_params.get('media_page', 1)
        media_paginator = Paginator(media, MAX_PAGE_LENGTH)
        data['media_pages'] = media_paginator.num_pages
        data['media'] = TweetUserSerializer(media_paginator.get_page(media_page), many=True).data

        # Users' Media' Likes Count and liked by user
        if isinstance(data['media'], list):
            for tweet in data['media']:
                likes_set = TweetLike.objects.filter(tweet=tweet['id'])
                tweet['likes_count'] = likes_set.count()
                likes_set = likes_set.filter(user=request.user)
                tweet['likes'] = TweetLikeSerializer(
                    likes_set,
                    many=True
                ).data

        # Users' Likes
        likes = TweetLike.objects.filter(user=user).order_by('-created_at')

        # Users' Likes' Pagination
        likes_page = self.request.query_params.get('likes_page', 1)
        likes_paginator = Paginator(likes, MAX_PAGE_LENGTH)
        data['likes_pages'] = likes_paginator.num_pages
        data['likes'] = TweetLikeExposeTweetSerializer(likes_paginator.get_page(likes_page), many=True).data

        # Users' LikedTweets' Likes Count and liked by user
        if isinstance(data['likes'], list):
            for tweetLike in data['likes']:
                likes_set = TweetLike.objects.filter(tweet=tweetLike['tweet']['id'])
                tweetLike['tweet']['likes_count'] = likes_set.count()
                likes_set = likes_set.filter(user=request.user)
                tweetLike['tweet']['likes'] = TweetLikeSerializer(
                    likes_set,
                    many=True
                ).data
        # Users' Followings
        followings = UserFollower.objects.filter(follower=user).order_by('-created_at')
        data['followings'] = UserFollowerExposeUserSerializer(followings, many=True).data
        data['followings_count'] = followings.count()
        # Users' Followers
        followers = UserFollower.objects.filter(user=user).order_by('-created_at')
        data['followers'] = UserFollowerExposeFollowerSerializer(followers, many=True).data
        data['followers_count'] = followers.count()
        return Response(data)

class TweetAPIView(viewsets.ModelViewSet):
    queryset = Tweet.objects.all()
    pages = 0

    def get_queryset(self):
        queryset = Tweet.objects.all()
        # show latest tweets first if sort=latest
        sort = self.request.query_params.get('sort', None)
        if sort and sort.lower() == 'latest':
            queryset = queryset.order_by('-created_at')
        # show following tweets if filter=following
        filter = self.request.query_params.get('filter', None)
        if filter and filter.lower() == 'following':
            followings = UserFollower.objects.filter(follower=self.request.user)
            users_following = []
            for following in followings:
                users_following.append(following.user)
            queryset = queryset.filter(user__in=users_following)
        
        # Tweets' Pagination
        page = self.request.query_params.get('page', 1)
        paginator = Paginator(queryset, MAX_PAGE_LENGTH)
        queryset = paginator.get_page(page)
        self.pages = paginator.num_pages
        return queryset
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return TweetUserSerializer
        else:
            return TweetWithoutUserSerializer
        
    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        # show tweet likes if ?related=likes
        related = self.request.query_params.get('related', None)
        if related and (related.lower() == 'likes_all' or related.lower() == 'likes_current'):
            if isinstance(serializer.data, list):
                for tweet in serializer.data:
                    likes_set = TweetLike.objects.filter(tweet=tweet['id'])
                    tweet['likes_count'] = likes_set.count()

                    if related.lower() == 'likes_current': # Only retrieve current user's likes
                        likes_set = likes_set.filter(user=request.user)

                    tweet['likes'] = TweetLikeSerializer(
                        likes_set,
                        many=True
                    ).data

                    # add props to show if user is following the tweet
                    tweet['is_following'] = False
                    followings = UserFollower.objects.filter(follower=request.user)
                    for following in followings:
                        if following.user.id == tweet['user']['id']:
                            tweet['is_following'] = True
                            break

        return Response(serializer.data, headers={'pages': self.pages})
    
    def perform_create(self, serializer):
        kwargs = {
            'user': self.request.user, 
            'text': serializer.validated_data['text'],
            'image': serializer.validated_data['image'],
        }
        serializer.save(**kwargs)

    def perform_update(self, serializer, **kwargs):
        tweet = self.get_object()
        # disable update other user' tweets
        if (tweet.user != self.request.user):
            raise CannotActionOtherUserInfoError(action='update', info='tweets')
        serializer.save(**kwargs)
    
    def perform_destroy(self, instance):
        tweet = self.get_object()
        # disable delete other user' tweets
        if (tweet.user != self.request.user):
            raise CannotActionOtherUserInfoError(action='delete', info='tweets')
        instance.delete()

class TweetLikeAPIView(viewsets.ModelViewSet):
    queryset = TweetLike.objects.all()

    def get_queryset(self):
        queryset = TweetLike.objects.all()

        current_user_query = self.request.query_params.get('current', None)
        tweet_query = self.request.query_params.get('tweet', None)

        valid_current_user_query = current_user_query and current_user_query.lower() == 'true'

        if valid_current_user_query:
            # filter tweet likes for current user
            queryset = queryset.filter(user=self.request.user.id)
        if tweet_query:
            # filter tweet likes for specified tweet
            queryset = queryset.filter(tweet=tweet_query)
        return queryset

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return TweetLikeSerializer
        else:
            return TweetLikeWithoutUserSerializer

    def perform_create(self, serializer):
        kwargs = {
            'user': self.request.user, 
            'tweet': serializer.validated_data['tweet']
        }
        serializer.save(**kwargs)
    
    def perform_update(self, serializer, **kwargs):
        tweetLike = self.get_object()
        # disable update other user' tweet likes
        if (tweetLike.user != self.request.user):
            raise CannotActionOtherUserInfoError(action='update', info='tweet likes')
        serializer.save(**kwargs)
    
    def perform_destroy(self, instance):
        tweetLike = self.get_object()
        # disable delete other user' tweet likes
        if (tweetLike.user != self.request.user):
            raise CannotActionOtherUserInfoError(action='delete', info='tweet likes')
        instance.delete()
    

class FollowAPIView(viewsets.ModelViewSet):
    queryset = UserFollower.objects.all()

    def get_queryset(self):
        queryset = UserFollower.objects.all()

        current_user_query = self.request.query_params.get('current', None)
        user_query = self.request.query_params.get('user', None)

        valid_current_user_query = current_user_query and current_user_query.lower() == 'true'

        if valid_current_user_query:
            # filter current user's follows
            queryset = queryset.filter(follower=self.request.user.id)
        if user_query:
            # filter follows for specified user
            queryset = queryset.filter(user=user_query)
        return queryset

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return UserFollowerSerializer
        else:
            return UserFollowerWithoutFollowerSerializer

    def perform_create(self, serializer):
        kwargs = {
            'follower': self.request.user, 
            'user': serializer.validated_data['user']
        }
        # Deny follow self
        if kwargs['user'].id == self.request.user.id:
            raise CannotFollowSelfError()
        serializer.save(**kwargs)

    def perform_update(self, serializer, **kwargs):
        follow = self.get_object()
        # disable update other user' follows
        if (follow.follower != self.request.user):
            raise CannotActionOtherUserInfoError(action='update', info='follows')
        # Deny follow self
        if serializer.validated_data['user'].id == self.request.user.id:
            raise CannotFollowSelfError()
        serializer.save(**kwargs)
    
    def perform_destroy(self, instance):
        follow = self.get_object()
        # disable delete other user' follows
        if (follow.follower != self.request.user):
            raise CannotActionOtherUserInfoError(action='delete', info='follows')
        instance.delete()


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username_or_email = request.POST["username/email"]
        password = request.POST["password"]
        user = authenticate(request, username=username_or_email, password=password) # username

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        name = request.POST["name"]
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure terms of service are accepted
        acceptTerms = request.POST.get("acceptTerms", False)
        if acceptTerms != "on":
            return render(request, "network/register.html", {
                "message": "You must accept the terms of service."
            })

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password, display_name=name)
            user = authenticate(request, username=username, password=password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
