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
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return TweetUserSerializer
        else:
            return TweetSerializer

class CurrentUserView(APIView):
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class TweetLikeAPIView(viewsets.ModelViewSet):
    queryset = TweetLike.objects.all()

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
