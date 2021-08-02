from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

from .models import User, Tweet, TweetLike, UserFollower
from .serializers import UserSerializer, TweetUserSerializer, TweetSerializer, TweetLikeSerializer, TweetLikeWithoutUserSerializer, UserFollowerSerializer
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response

class UserAPIView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

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
            return TweetSerializer
        
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

class CurrentUserView(APIView):
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

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
    

class FollowAPIView(viewsets.ModelViewSet):
    queryset = UserFollower.objects.all()
    serializer_class = UserFollowerSerializer




def index(request):
    return render(request, "network/index.html")

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
