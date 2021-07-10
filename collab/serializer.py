from rest_framework import serializers
from . models import *
  
class SimpleUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('name', 'description',)

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tags
        fields = ('tagName',)

class ReactSerializer(serializers.ModelSerializer):
    users = SimpleUserSerializer(many=True)
    tags = TagSerializer(many=True)
    class Meta:
        model = Project
        fields = ('name', 'detail', 'users', 'tags',)

class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = ('name', 'user', 'project',)

class UserSerializer(serializers.ModelSerializer):
    projects = ReactSerializer(many=True)
    class Meta:
        model = User
        fields = ('projects', 'name', 'description', 'seenNotifications',)

class RequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Request
        fields = ['project', 'user', 'message',]

class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['name', 'username', 'password',]

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['name', 'username', 'password', 'email', 'githubId',]

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['message', 'project', 'user',]

class DiscussionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discussions
        fields = ['message','user', 'project',]