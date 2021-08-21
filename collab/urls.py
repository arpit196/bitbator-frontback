"""collab URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf.urls import url
from django.views.generic import TemplateView
from .views import *
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('wel/', ReactView.as_view(), name="something"),
    path('users/', UsersView.as_view()),
    path('user/<str:name>', UserView.as_view()),
    path('user/<str:name>/image', ImageView.as_view()),
    path('user/<str:name>/requests', RequestUserView.as_view()),
    path('user/<str:name>/requests/rec', views.getReceivedRequests),
    path('user/<str:name>/requests/<str:project>', RequestView.as_view()),
    #path('requests/', RequestView.as_view()),
    path('project/<str:project>/user/<str:name>/branch', BranchView.as_view()),
    path('user/<str:user>/notifications', NotificationsView.as_view()),
    path('project/<str:name>/users', views.getProjectUsers),
    path('project/<str:name>/user', ProjectView.as_view()),
    path('project/<str:name>/requests', RequestView.as_view()),
    path('project/<str:name>/discussions', DiscussionsView.as_view()),
    path('project/<str:name>/files', FileView.as_view()),
    path('project/<str:name>', ProjectView.as_view()),
    path('compare/', views.compareProjects),
    path('compareUsers/', views.compareUsers),
    path('tags/', TagView.as_view()),
    path('login/', LoginView.as_view()),
    path('image/', ImageView.as_view()),
    path('dashboard/', TemplateView.as_view(template_name='index.html'))
]
