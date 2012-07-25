from django.contrib.auth.models import User

def auth_user(email,passwd):
	try:
		user = User.objects.get(email=email)
		if user.check_password(passwd):
			return True
		else:
			raise
	except:
		return False
		
		
