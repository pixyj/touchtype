from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import HttpResponseRedirect
from django.http import Http404

import simplejson
import pdb

from django.contrib import auth
from django.contrib.auth.models import User
from logic import auth_user

def login(request):
	#pdb.set_trace()
	if request.user.is_authenticated():
		return HttpResponseRedirect("/touch/")
		
	if request.method == 'GET':
		return render_to_response('login.html',
			context_instance=RequestContext(request))
			
	if request.method == 'POST':		
		#pdb.set_trace()
		data = request.POST['data']
		data = simplejson.loads(data);
		if not data['signup']:
			user = auth.authenticate(username=data['username'],
				password=data['password'])
		else:
			try:
				user = User.objects.create(username=data['username'])
				user.set_password(data['password'])
				user.save();
				user = auth.authenticate(username=data['username'],password=data['password'])
			except:
				user = None
				
		json_msg = {'success':False}		
		if user != None:
			auth.login(request,user)
			json_msg['success'] = True;
		
		return HttpResponse(simplejson.dumps(json_msg),mimetype="application/json")

	raise Http404;
