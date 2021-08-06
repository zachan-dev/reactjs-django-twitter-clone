from django.urls import path, include
from rest_framework import routers
from . import views

api_router = routers.DefaultRouter()
api_router.register(r'user', views.UserAPIView)
api_router.register(r'tweet', views.TweetAPIView)
api_router.register(r'tweet_like', views.TweetLikeAPIView)
api_router.register(r'follow', views.FollowAPIView)

urlpatterns = [
    # --------------------- Authentication
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    # --------------------- API
    path('api/', include(api_router.urls)),
    path('api/current_user/', views.CurrentUserView.as_view(), name="current_user"),
    path('api/username/<str:username>/', views.UserByUsernameView.as_view(), name="current_user"),
]
