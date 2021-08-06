from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect

# Create your views here.
@login_required
def index(request):
    return render(request, 'frontend/index.html')

@login_required
def profile(request):
    return redirect('/profile/{}'.format(request.user.username))