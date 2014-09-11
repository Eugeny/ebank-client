from datetime import datetime
import base64
import json
import os
import subprocess
import time
import traceback

from django.shortcuts import render, get_object_or_404
from django.conf import settings
from django.http import HttpResponse, HttpResponseRedirect

from apps.main.models import *

from libs.backend import ElementsBackend
from libs.cluster import ping_nodes, select_volume_node, get_storage_status


def clientapi(fx):
    def wrapper(request, *args, **kwargs):
        try:
            username = request.REQUEST.get('auth_username', None)
            password = request.REQUEST.get('auth_password', None)
            user = None
            try:
                user = ElementsUser.objects.get(username=username, password=password)
            except:
                r = {
                    'status': 'auth-error',
                }
            if user:
                user.last_address = request.META.get('REMOTE_ADDR', user.last_address)
                user.last_seen = datetime.now()
                user.save()
                r = {
                    'status': 'ok',
                    'data': fx(request, user=user, *args, **kwargs),
                }
        except Exception, e:
            traceback.print_exc()
            r = {
                'status': 'error',
                'error': str(e),
                'traceback': traceback.format_exc(),
            }
        return HttpResponse(json.dumps(r))
    return wrapper


@clientapi
def test(request, user):
    return None


@clientapi
def stats(request, user):
    iostat = subprocess.Popen(['/usr/bin/iostat', '-xd', '1', '2'], stdout=subprocess.PIPE)
    time.sleep(1)
    o, e = iostat.communicate()
    lines = o.splitlines()

    s = 0
    for l in lines[len(lines)/2:]:
        try:
            s += float(l.split()[-1])
        except:
            pass

    return int(s)


@clientapi
def check_in(request, user, wid=None):
    if wid:
        w = Workspace.objects.get(id=int(wid))
        UserActivity.objects.get_or_create(user=user, workspace=w)[0].save()
    return None


@clientapi
def check_out(request, user, wid=None):
    if wid:
        w = Workspace.objects.get(id=int(wid))
        UserActivity.objects.filter(user=user, workspace=w).delete()
    else:
        user.last_seen = None
        user.save()
    return None
    

@clientapi
def list_projects(request, user):
    node_statuses = ping_nodes()
    snfs_status = ElementsBackend().get_status()
    storage_status = get_storage_status()
    res = []
    for p in Project.objects.filter(active=True).all():
        pd = p.to_json()
        pd['workspaces'] = []
        res.append(pd)
        for w in p.workspaces.all():
            node = select_volume_node(w.volume, node_statuses=node_statuses)
            if not node:
                continue
            allowed = False
            if w.rw_access_group and w.rw_access_group.members.filter(id=user.id).exists():
                allowed = True
            if w.ro_access_group and w.ro_access_group.members.filter(id=user.id).exists():
                allowed = True
            if not allowed:
                continue
            wd = w.to_json()
            pd['workspaces'].append(wd)
            wd['size_used'] = wd['size_total'] = 0
            wd['storage_host'] = node.address
            if node.id in snfs_status:
                node_snfs_status = snfs_status[node.id]
                wd['size_used'] = storage_status['volumes'][w.volume_id]['size_used']
                wd['size_total'] = storage_status['volumes'][w.volume_id]['size_total']
                if node_snfs_status:
                    for sg in node_snfs_status['stripegroups']:
                        if sg['affinity'] and sg['affinity'] == w.affinity:
                            wd['size_used'] = sg['used']
                            wd['size_total'] = sg['total']
                    for k, q in node_snfs_status['quotas'].iteritems(): 
                        if k.endswith(w.directory):
                            if q['hard']:
                                wd['size_used'] = q['current']
                                wd['size_total'] = q['hard']
    return res
    