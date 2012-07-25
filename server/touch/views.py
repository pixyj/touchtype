from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import Http404
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect

import simplejson
import touch
import pdb

from touch.models import UserLevel,Line,LevelContent

def content(request):
	if(request.is_ajax()):
		#pdb.set_trace()
		get_content = request.GET['getContent']
		get_content = True if get_content == 'true' else False
		json_msg = {}
		if(get_content):
			json_msg['levels'] = touch.LEVEL_DICT
			json_msg['words'] = touch.LEVEL_WORDS
		return HttpResponse(simplejson.dumps(json_msg),mimetype="application/json")
	else:
		raise Http404
		
def index(request):
	#pdb.set_trace()
	if request.user.is_authenticated() == False:
		return HttpResponseRedirect('/login/');
	return render_to_response('touch.html',context_instance=RequestContext(request))
	
def update_level(request):
	#userAuth
	#pdb.set_trace()
	if request.user.is_authenticated() == False:
		raise Http404;
	user = request.user	
	data = simplejson.loads(request.POST['data'])
	level = int(data['level'])
	try:
		ul=UserLevel.objects.get(user=user)
		ul.level = level
		ul.save()
	except:
		ul = UserLevel.objects.create(user=user,level=level) 
	
	json_msg = {'saved':True}
	return HttpResponse(simplejson.dumps(json_msg),mimetype="application/json")
	
###############################################################################	
	
def store_line(request):
	#userAuth
	"""
	Example Data:
	data = {'level':1,'accuracy':0.8,'timestamp':1343434343434L}
	"""
	#pdb.set_trace()
	if request.user.is_authenticated() == False:
		raise Http404;
	u = request.user
	data = simplejson.loads(request.POST['data'])
	data['level'] = int(data['level'])
	data['accuracy'] = float(data['accuracy'])
	data['timestamp'] = int(data['timestamp'])
	data['speed'] = float(data['speed'])
	Line.objects.create(user=u,**data)
	return HttpResponse("OK")
	
###############################################################################

def get_line_data(request):
	#userAuth
	if request.user.is_authenticated() == False:
		raise Http404;
	user = request.user	
	lines = user.line_set.all()
	data = []
	for line in lines:
		del line._state
		data.append((line.speed,line.accuracy,line.level,line.timestamp))
	data = {'records': data}		
	json_msg = simplejson.dumps(data)
	return HttpResponse(json_msg,mimetype="application/json")
	
###############################################################################	
	
def get_level_content(request):
	
	"""For end users """
	#pdb.set_trace()
	
	json_req = request.GET['data']
	data = simplejson.loads(json_req)
	
	level = data['level']
	
	content_dict = {'level':level}
	try:
		content_dict['content'] = LevelContent.objects.get(level=level).content
	except:
		content_dict['content'] = ""
	return HttpResponse(simplejson.dumps(content_dict),mimetype="application/json")	
	
###############################################################################

def get_user_level(request):
	user = request.user
	if not user.is_authenticated():
		raise Http404
	
	try:
		user_level = UserLevel.objects.get(user=user)
	except:
		user_level = UserLevel.objects.create(user=user,level=0)
	finally:
		level_dict = {'level':user_level.level}
		return HttpResponse(simplejson.dumps(level_dict),mimetype="application/json")
	
	
###############################################################################	

def edit_level_content(request):

	""" Used by admin """
	
	if request.user.is_superuser == False:
		raise Http404
	
	if request.method == 'GET':
		level = request.GET['level']
		content = {}
		content['level'] = level
		try:
			content['content'] = LevelContent.objects.get(level=level).content
		except:
			content['content'] = ""
		return HttpResponse(simplejson.dumps(content),mimetype="application/json")	
	
	elif request.method == 'POST':
		data = simplejson.loads(request.POST['data'])
		level = data['level']
		try:
			level_content = LevelContent.objects.get(level=level)
		except:
			level_content = LevelContent.objects.create(level=level,content="")
			
		level_content.content = data['content']
		level_content.save()
		return HttpResponse("Ok")
	else:
		return HttpResponse("Ok")	
			
		
###############################################################################
#Admin
###############################################################################

def content_admin(request):

	if request.user.is_superuser == False:
		raise Http404

	if request.method == 'GET':
		context = RequestContext(request)
		return render_to_response('content_admin.html',context_instance=context)
	else:
		return HttpResponse("phew")	

###############################################################################
		
def stats_admin(request):
	if request.user.is_superuser == False:
		raise Http404
	if request.method == 'GET':
		
		stats = {}
		stats['users'] = User.objects.count()
		stats['lines'] = Line.objects.count()
	
		return render_to_response('stats_admin.html',stats)
	
	else:
		raise Http404
		
	
