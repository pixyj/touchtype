"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".

Replace this with more appropriate tests for your application.
"""

from django.test import TestCase
from django.contrib.auth.models import User
from models import *

class SimpleTest(TestCase):
    def test_basic_addition(self):
        """
        Tests that 1 + 1 always equals 2.
        """
        self.assertEqual(1 + 1, 2)
        
def check_lines():
	u = User.objects.get(pk=1)
	for i in xrange(100):
		Line.objects.create(user=u,speed=50,accuracy=0.9,timestamp=1,level=1)

	
