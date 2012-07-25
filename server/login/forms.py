from django import forms

class LoginForm(forms.Form):
	username = forms.EmailField(label="Username")
	password = forms.CharField(widget=forms.PasswordInput,label="Password")
	
