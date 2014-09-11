from django.conf.urls import patterns, url, include
from django.views.generic import TemplateView

from tastypie.api import Api
from apps.main.api import *

api = Api(api_name='1')
api.register(ElementsUserResource())
api.register(ElementsGroupResource())
api.register(UserActivityResource())
api.register(ProjectResource())
api.register(WorkspaceResource())
api.register(StorageNodeResource()) 
api.register(StorageVolumeResource()) 
api.register(ShareResource()) 
api.register(DownloadResource()) 
api.register(OneTimeAccessTokenResource()) 
api.register(OneTimeAccessTokenActivityResource()) 

api.register(TapeResource()) 
api.register(TapeGroupResource()) 
api.register(EntryResource()) 

api.register(MediaRootResource()) 
api.register(MediaRootPermissionResource()) 
api.register(MediaFileResource()) 
api.register(MediaAssetResource()) 
api.register(MediaAssetBackupResource()) 
api.register(MediaAssetEntryResource()) 
api.register(MediaAssetEntryApprovalResource()) 
api.register(MediaCommentResource()) 
api.register(MediaUpdateResource()) 
api.register(MediaEditorProjectResource()) 
api.register(MediaEditorProjectSegmentResource()) 
api.register(MediaTagResource()) 

api.register(TaskReportResource()) 
api.register(IntervalScheduleResource()) 
api.register(CrontabScheduleResource()) 
api.register(PeriodicTaskResource()) 
 
api.register(TieringCriterionResource()) 
api.register(TieringDestinationResource()) 


urlpatterns = patterns(
    'apps.main.views.main',
    url(r'^$', 'index'),
    url(r'^template/(?P<template_name>.+)$', 'template'),

    url(r'^api/', include(api.urls)),

    url(r'^api/identify', 'identify'),

    url(r'^api/configure-workspaces', 'configure_workspaces'),
    url(r'^api/configure-users', 'configure_users'),
    url(r'^api/configure-groups', 'configure_groups'),
    url(r'^api/configure-shares', 'configure_shares'),
    
    url(r'^api/request-storage-status', 'request_storage_status'),
    url(r'^api/request-snfs-status', 'request_snfs_status'),
    url(r'^api/list-templates', 'list_templates'),
 
    #TODO: to media urls
    url(r'^api/start-workspace-media-scan/(?P<id>\d+)', 'start_workspace_media_scan'),
    url(r'^api/start-media-root-media-scan/(?P<id>\d+)', 'start_media_root_media_scan'),
)

urlpatterns += patterns(
    'apps.main.views.auth',
    url(r'^auth/login$', '_login'),
    url(r'^auth/logout$', '_logout'),
    url(r'^auth/fast-lane/(?P<token>.+)$', 'fast_lane'),
)

urlpatterns += patterns(
    'apps.main.views.client',
    url(r'^api/client/test$', 'test'),
    url(r'^api/client/stats$', 'stats'),
    url(r'^api/client/check-in/$', 'check_in'),
    url(r'^api/client/check-in/(?P<wid>\d+)$', 'check_in'),
    url(r'^api/client/check-out/$', 'check_out'),
    url(r'^api/client/check-out/(?P<wid>\d+)$', 'check_out'),
    url(r'^api/client/list-projects$', 'list_projects'),
)

urlpatterns += patterns(
    'apps.main.views.stats',
    url(r'^api/stats', 'stats'),
)

urlpatterns += patterns(
    'apps.main.views.downloads',
    url(r'^download/(?P<id>\d+)', 'download'),
)

urlpatterns += patterns(
    'apps.main.views.fs',
    url(r'^api/fs/list/(?P<path>.+)$', 'fs_list'),
    url(r'^api/fs/info/(?P<path>.+)$', 'fs_info'),
    url(r'^api/fs/create-dir/(?P<path>.+)$', 'fs_create_dir'),
    url(r'^api/fs/copy$', 'fs_copy'),
    url(r'^api/fs/rename$', 'fs_rename'),
    url(r'^api/fs/delete$', 'fs_delete'),
    url(r'^api/fs/chmod$', 'fs_chmod'),
    url(r'^api/fs/set-affinity$', 'fs_set_affinity'),
)
