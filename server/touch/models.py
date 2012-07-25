from django.db import models
from django.contrib.auth.models import User

class UserLevel(models.Model):
	level = models.IntegerField()
	user = models.ForeignKey(User)

class Line(models.Model):
	user = models.ForeignKey(User)
	level = models.IntegerField()
	accuracy = models.FloatField()
	timestamp = models.FloatField()
	speed = models.FloatField()
	
class LevelContent(models.Model):
	level = models.IntegerField()
	content = models.TextField()
