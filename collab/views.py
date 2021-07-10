from django.shortcuts import render
from rest_framework.views import APIView
from . models import *
from rest_framework.response import Response
from . serializer import *
from django.http import JsonResponse
from django.http import HttpResponse
from django.core import serializers
from rest_framework.decorators import api_view, renderer_classes
from rest_framework import status
from rest_framework.renderers import JSONRenderer, TemplateHTMLRenderer
from . helper.comparator import *
from rest_framework.exceptions import APIException
from . utility import *

# Create your views here.

def createUserList(project):
	user_list = []
	for user in project.users.all():
		user_list.append({"name": user.name, "description": user.description})
	return user_list

def createTagList(project):
	tag_list = []
	for tag in project.tags.all():
		tag_list.append({"name": tag.tagName})
	return tag_list

class ImageView(APIView):
	def get(self, request, name):
		img = ImageField.objects.filter(user = name).first()
		print(img.url)
		return Response(img.url)

	def post(self, request, name):
		uri = request.data["uri"]
		user = request.data["user"]
		img = request.data["img"]
		image = ImageField.objects.create(url=uri, user=user, image = img)
		print(image.url)
		image.save()
		return HttpResponse(status=status.HTTP_200_OK)

class ReactView(APIView):
	
	serializer_class = ReactSerializer

	def get(self, request):
		projects = []
		
		for project in Project.objects.all():
			user_list = createUserList(project)
			tag_list = createTagList(project)
			projects.append({"name": project.name,"detail": project.detail, "users": user_list, "allowRequest": project.allowRequest, "tags": tag_list})
		
		#detail = [ {"name": detail.name,"detail": detail.detail, "users": user_list}
		#for detail in Project.objects.all()]

		return Response(projects)

	def post(self, request):
		#serializer = ReactSerializer(data=request.data)
		project = Project.objects.create(name = request.data["name"], detail = request.data["detail"])
		tag_list = []
		users_list = []
		for tag in request.data["tags"]:
			new_tag = Tags.objects.create(tagName = tag["tagName"])
			project.tags.add(new_tag)
			
		print(request.data)
		#print(serializer)
		#for tag in request.data["tags"]:
		#	serializer.tags.add(TagSerializer({"name": tag}))
		#if serializer.is_valid(raise_exception=True):		#\\someissue here
		project.save()
		#return Response(serializer.data)
		#serializedResponse = serializers.serialize('json', Project.objects.filter(name=request.data["name"]))
		return Response(status=status.HTTP_200_OK)

class UserView(APIView):
	
	#serializer_class = ReactSerializer

	def get(self, request, name):
		user = User.objects.filter(name=str(name))
		data = UserSerializer(user, many=True).data
		print(data)
		return JsonResponse(data, safe=False)

	def post(self, request):
		user_object = User.objects.filter(name=str(name))
		serializer = UserSerializer(data=request.data)
		if serializer.is_valid(raise_exception=True):
			serializer.save()
			return Response(serializer.data)

	'''def patch(self, request, pk):
		user_object = User.objects.filter(name=str(name))
		serializer = ReactSerializer(data=request.data)
		user_object.project_set.add(serializer)
		#serializer = UserSerializer(user_object, data=request.data, partial=True)
		if serializer.is_valid():
			user_object.save()
			return JsonResponse(code=201, data=serializer.data)
		return JsonResponse(code=400, data="wrong parameters")'''
	def patch(self, request, name):
		user_object = User.objects.filter(name=str(name)).first()
		print(user_object)
		data = request.data
		#serializer = ReactSerializer(data=request.data)
		project=None

		if("project" in data.keys()):
			project = Project.objects.get(name=data["project"])
		#project = {"name" : data["name"], "detail" : data["description"]}
		
		#if(data["visible"]):
		#		project["visible"]: data["visible"]
		
		#if(data["access"]):
		#		project["access"]: data["access"]
		
		#user_object[0].projects.add(project)
		if("seenNotifications" in data.keys()):
			user_object.seenNotifications = int(data["seenNotifications"])
			print(data["seenNotifications"])
		serializer = UserSerializer(user_object, data=request.data, partial=True)
		if serializer.is_valid():
			if(project):
				user_object.projects.add(project)
			print(user_object.seenNotifications)
			user_object.save()
			#return JsonResponse(data=serializer.data)
			return HttpResponse(user_object)
		#return JsonResponse(code=400, data="wrong parameters")

class UsersView(APIView):
	
	#serializer_class = ReactSerializer

	def get(self, request):
		users = User.objects.all()
		#data = UserSerializer(users, many=True).data
		user_list = [ {"name": user.name, "description": user.description} for user in users]
		return Response(user_list)

	def post(self, request):
		user_object = User.objects.filter(name=str(name))
		serializer = UserSerializer(data=request.data)
		if serializer.is_valid(raise_exception=True):
			serializer.save()
			return Response(serializer.data)

	def patch(self, request, pk):
		user_object = User.objects.filter(name=str(name))
		data = request.data
		print(data)
		#serializer = ReactSerializer(data=request.data)
		project = {"name" : data.name, "detail" : data.description}
		user_object.project_set.add(project)
		#serializer = UserSerializer(user_object, data=request.data, partial=True)
		#if serializer.is_valid():
		user_object.save()
		return JsonResponse(code=201, data=serializer.data)
		#return JsonResponse(code=400, data="wrong parameters")

class BranchView(APIView):

	def get(self, request, name, project):
		branches = Branch.objects.filter(user = name, project=project)
		response = [{"name": branch.name,"user": branch.user} for branch in branches] 
		return Response(response)
	
	def post(self, request, name, project):
		branch = {"name": request.data["branchName"], "user": name, "project": project}
		serializer = BranchSerializer(data=branch)
		if serializer.is_valid(raise_exception=True):
			serializer.save()
		return Response(serializer.data)

class ProjectView(APIView):
	
	serializer_class = ReactSerializer

	def get(self, request, name):
		project = Project.objects.get(name = name)
		tag_list = createTagList(project)
		response = {"name": project.name,"description": project.detail, "tags": tag_list, "allowRequest": project.allowRequest} 
		return Response(response)

	def post(self, request):
		serializer = ReactSerializer(data=request.data)
		if serializer.is_valid(raise_exception=True):
			serializer.save()
			return Response(serializer.data)
	
	def patch(self, request, name):
		print("Hellpkwep2")
		print(request.data)
		print("Hellpkwep")
		requestData = request.data
		serialized = []
		project = Project.objects.get(name = name)
		print(project.name)
		if("description" in requestData.keys()):
			project.detail = requestData["description"]
			project.save()
		
		if("tags" in requestData.keys()):
			project.tags.clear()
			for tag in requestData["tags"]:
				tag = Tags.objects.create(tagName = tag["name"])
				project.tags.add(tag)

		if("user" in requestData.keys()):
			print("Hellpkwep23232")
			user = User.objects.get(name = requestData["user"])
			project.users.add(user)
			project.save()
			serialized = ReactSerializer(project).data
			#return JsonResponse(serialized)
		if("allowRequest" in requestData.keys()):
			project.allowRequest = True if requestData["allowRequest"] == True else False
			project.save()
			serialized = ReactSerializer(project).data
		
		return JsonResponse(serialized, safe=False)
	
	def delete(self, request, name):
		#serializer = ReactSerializer(data=request.data)
		projects = Project.objects.filter(name = name)
		for project in projects:
			project.delete()
		return Response(status=204)

class RequestView(APIView):
	
	serializer_class = RequestSerializer

	def get(self, request, user):
		requests = Request.objects.filter(user = user)
			#requests = Request.objects.get(project = user)
		response_list=[]
		for request in requests:
			response_list.append({"user": request.user, "request": request.project, "message": request.message})
		#response = {"user": requests.user, "request": requests.project}
		return Response(response_list)

	def post(self, request, user):
		print(request.data)
		serializer = RequestSerializer(data=request.data)
		if serializer.is_valid(raise_exception=True):
			serializer.save()
			return Response(serializer.data)
	
	def delete(self, request, user):
		print(request.data)
		project = request.data["project"]
		requests = Request.objects.filter(user = user,project = project)
		print(requests)
		print("mnnneerer")
		for request in requests:
			request.delete()
		requests = Request.objects.filter(user = user,project = project)
		return Response(status=status.HTTP_204_NO_CONTENT)

class NotificationsView(APIView):
	
	serializer_class = NotificationSerializer

	def get(self, request, user):
		notifications = Notification.objects.filter(user = user)
		notifications_list=[]
		for notification in notifications:
			notifications_list.append({"message": notification.message, "user": notification.user, "project": notification.project})
		return JsonResponse(notifications_list, safe=False)

	def post(self, request, user):
		print(request.data)
		serializer = NotificationSerializer(data=request.data)
		if serializer.is_valid(raise_exception=True):
			serializer.save()
			return Response(serializer.data)

class DiscussionsView(APIView):

	serializer_class = DiscussionsSerializer

	def get(self, request, name):
		discussions = Discussions.objects.filter(project = name)
		discussion_list = []
		for discussion in discussions:
			discussion_list.append({"message": discussion.message, "project": name, "user": discussion.user})
		return Response(discussion_list)

	def post(self, request, name):
		serializerInput = request.data
		serializerInput["project"] = name
		print(serializerInput)
		serializer = DiscussionsSerializer(data=serializerInput)
		if serializer.is_valid(raise_exception=True):
			print("Hello")
			serializer.save()
			print(serializer)
			return JsonResponse(serializer.data)

class LoginView(APIView):
	
	serializer_class = LoginSerializer

	def get(self, request):
		requests = Profile.objects.get(pk=1)
		#serialized = LoginSerializer(requests)
		requests = {"name" : requests.name, "password" : requests.password, "username": requests.username}
		print(requests)
		return JsonResponse(requests)

	def post(self, request):
		serializer = LoginSerializer(data=request.data)
		user = Profile.objects.get(username=request.data["username"])
		if user.password != request.data["password"]:
			raise Exception("Invalid username or password")
		response = {"name" : user.name, "password" : user.password, "username": user.username}
		return Response(response)
	
	def patch(self, request):
		if(not validatePassword(request.data["password"])):
			raise Exception("Password is not valid")

		if(not mandatoryMissing(request.data, ["username", "password", "name", "email"])):
			raise Exception("Mandatory Parameters cannot be null")

		profile = ProfileSerializer(data=request.data)
		if(profile.is_valid(raise_exception=True)):
			profile.save()
			return JsonResponse(profile.data)

class TagView(APIView):
	def get(self, request):
		tag_list = []
		for tag in Tags.objects.all():
			tag_list.append({"name": tag.tagName})
		
		return Response(tag_list)

	def post(self, request, tagName):
		newTag = Tags.objects.create(tagName = tagName)
		newTag.save()
		return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(('GET',))
#@renderer_classes((JSONRenderer))
def getProjectUsers(request, name):

	project = Project.objects.get(name=name)
	projectUsers = project.users.all()
	#return Response(projectUsers)
	projectUsers = serializers.serialize('json', projectUsers)
	return HttpResponse(projectUsers, content_type="application/json")

@api_view(('GET',))
#@renderer_classes((JSONRenderer))
def getProjectRequests(request, name):
	requests = Request.objects.filter(project = name)
	response_list=[]
	for request in requests:
		response_list.append({"user": request.user, "request": request.project, "message": request.message})	
	#response = {"user": requests.user, "request": requests.project}
	return Response(response_list)

@api_view(('GET',))
#@renderer_classes((JSONRenderer))
def getProjectDiscussions(request, name):
	discussions = Discussions.objects.filter(project = name)
	discussion_list=[]
	for discussion in discussions:
		discussion_list.append({"user": request.user, "request": request.project, "message": request.message})	
	#response = {"user": requests.user, "request": requests.project}
	return Response(discussion_list)

@api_view(('GET',))
def getProjectTags(request):
	tags = Tags.objects.all()
	return Response(tags)

@api_view(('POST',))
def compareProjects(request):
	print(request.data["tags"])
	score = compare(request.data["searchInput"], request.data["project"], request.data["tags"])
	return Response(score)

