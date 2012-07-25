from django.conf.urls.defaults import patterns, include, url

#List of touch urls
#Users + Admin

urlpatterns = patterns('touch.views',
	url(r'^content/$','content'),
	url(r'^$','index'),
	url(r'^update_level/$','update_level'),	
	url(r'^store_line/$','store_line'),	
	url(r'^get_level_content/$','get_level_content'),
	url(r'^edit_level_content/$','edit_level_content'),
	url(r'^get_line_data/$','get_line_data'),
	url(r'^content_admin','content_admin'),
	url(r'^get_user_level/$','get_user_level'),
	url(r'^stats_admin/$','stats_admin'),
)
