from django.db import models
from django.core.files import File  # you need this somewhere
import urllib, os
  
# Create your models here.

class Interest:
    interests = models.CharField(max_length=300)

class Tags(models.Model):
    tagName =  models.CharField(max_length=200, default="")  
  
class Project(models.Model):
    name = models.CharField(max_length=30)
    detail = models.CharField(max_length=500)
    users = models.ManyToManyField('User')
    tags = models.ManyToManyField('Tags')
    allowRequest = models.BooleanField(default=True)

class Branch(models.Model):
    name = models.CharField(max_length=30)
    user = models.CharField(max_length=100)
    project = models.CharField(max_length=100)
    
class Request(models.Model):
    user = models.CharField(max_length=30)
    project = models.CharField(max_length=100)
    message = models.CharField(max_length=600)

class User(models.Model):
    name = models.CharField(max_length=30)
    description = models.CharField(max_length=500)
    projects = models.ManyToManyField(Project)
    requests = models.ManyToManyField(Request, related_name='+')
    visible = models.BooleanField()
    seenNotifications = models.IntegerField()
    allowRequest = models.BooleanField(default=True)
    #interests = models.ManyToManyField(Interest)
    access = models.CharField(max_length=100)

class LogIn(models.Model):
    username = models.CharField(max_length=30)
    password = models.CharField(max_length=100)

class Notification(models.Model):
    message = models.CharField(max_length=600)
    user = models.CharField(max_length=30)
    project = models.CharField(max_length=30)

class Discussions(models.Model):
    project = models.CharField(max_length=100)
    message = models.CharField(max_length=700)
    user = models.CharField(max_length=100)

class Profile(models.Model):
    name = models.CharField(max_length = 100)
    username = models.CharField(max_length = 100)
    password = models.CharField(max_length = 200)
    email = models.CharField(max_length = 100)
    githubId = models.CharField(max_length = 200)

class Message(models.Model):
    message = models.CharField(max_length = 1000)
    sender = models.CharField(max_length = 30)
    receiver = models.CharField(max_length = 30)

class ImageField(models.Model):
    user = models.CharField(max_length=30)
    image = models.ImageField()
    url = models.CharField(max_length=255, unique=True)

    def cache(self):
        """Store image locally if we have a URL"""
        if self.url and not self.photo:
            result = urllib.urlretrieve(self.url)
            self.photo.save(
                    os.path.basename(self.url),
                    File(open(result[0], 'rb'))
                    )
            self.save()
    