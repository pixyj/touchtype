from django.conf.urls.defaults import patterns, include, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

import views

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'Touch.views.home', name='home'),
    # url(r'^Touch/', include('Touch.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)

urlpatterns += patterns('',
	url(r'^touch/',include('touch.urls')),
	
)

urlpatterns += patterns('',
	url(r'^login/',include('login.urls')),
)

#Home page

urlpatterns += patterns('',
	url(r'^$','views.home'),
)

