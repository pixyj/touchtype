from django.conf.urls.defaults import patterns, include, url

urlpatterns = patterns('login.views',
	url(r'^$','login'),
)
