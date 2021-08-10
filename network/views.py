from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponseRedirect
from django.shortcuts import render, get_object_or_404
from django.urls import reverse
from django.core.exceptions import PermissionDenied

from .models import User, Tweet, TweetLike, UserFollower
from .serializers import UserSerializer, TweetUserSerializer, TweetLikeExposeTweetSerializer, TweetWithoutUserSerializer, TweetLikeSerializer, TweetLikeWithoutUserSerializer, UserFollowerSerializer, UserFollowerWithoutFollowerSerializer
from .exceptions import CannotFollowSelfError, CannotActionOtherUserInfoError
from rest_framework import viewsets, mixins
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action

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
        data['tweets'] = TweetUserSerializer(tweets, many=True).data
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
        # Users' Likes
        likes = TweetLike.objects.filter(user=user).order_by('-created_at')
        data['likes'] = TweetLikeExposeTweetSerializer(likes, many=True).data
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
        return Response(data)

class TweetAPIView(viewsets.ModelViewSet):
    queryset = Tweet.objects.all()

    def get_queryset(self):
        queryset = Tweet.objects.all()
        # show latest tweets first if sort=latest
        sort = self.request.query_params.get('sort', None)
        if sort and sort.lower() == 'latest':
            queryset = queryset.order_by('-created_at')
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

        return Response(serializer.data)
    
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
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

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
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
