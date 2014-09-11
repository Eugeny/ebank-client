import json
import os
import stat
import subprocess

from celery.execute import send_task
from django.contrib.auth.decorators import login_required
from django.conf import settings
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, get_object_or_404

from libs.push import web_push

from apps.main.models import Download


STAT_BITS = [
    stat.S_IRUSR,
    stat.S_IWUSR,
    stat.S_IXUSR,
    stat.S_IRGRP,
    stat.S_IWGRP,
    stat.S_IXGRP,
    stat.S_IROTH,
    stat.S_IWOTH,
    stat.S_IXOTH,
]


def __get_info(path):
    stat = os.stat(path)

    r = {
        'parent': os.path.split(path)[0],
        'name': os.path.split(path)[1],
        'path': path,
        'str_mode': '%03o' % stat.st_mode,
        'size': os.path.getsize(path),
        'isdir': os.path.isdir(path),
        'mtime': stat.st_mtime,
        'atime': stat.st_atime,
        'ctime': stat.st_ctime,
        'affinity': None,
    }

    affinity_output = None
    try:
        affinity_output = subprocess.check_output(['/usr/cvfs/bin/cvaffinity', '-l', path])
    except:
        pass

    if affinity_output:
        r['affinity'] = affinity_output.split()[1]
        if r['affinity'] == '<none>':
            r['affinity'] = None

    r['mod_ur'], r['mod_uw'], r['mod_ux'], \
        r['mod_gr'], r['mod_gw'], r['mod_gx'], \
        r['mod_ar'], r['mod_aw'], r['mod_ax'] = [
            (stat.st_mode & STAT_BITS[i] != 0)
            for i in range(0, 9)
        ]

    return r


@login_required
def fs_list(request, path):
    if os.path.exists(path):
        res = [__get_info(os.path.join(path, x)) for x in os.listdir(path)]
        res = sorted(res, key=lambda x: (not x['isdir'], x['name']))
    else:
        res = []
    return HttpResponse(json.dumps(res))


@login_required
def fs_info(request, path):
    return HttpResponse(json.dumps(__get_info(path)))


@login_required
def fs_create_dir(request, path):
    os.makedirs(path)
    web_push('fs:refresh')
    return HttpResponse('')


@login_required
def fs_copy(request):
    data = json.loads(request.body)
    kwargs = {
        'source': data['source'],
        'destination': data['destination'],
    }
    if data['move']:
        send_task('fm.move', [], kwargs)
    else:
        send_task('fm.copy', [], kwargs)
    return HttpResponse('')


@login_required
def fs_delete(request):
    data = json.loads(request.body)
    kwargs = {
        'source': data['source'],
    }
    send_task('fm.delete', [], kwargs)
    return HttpResponse('')


@login_required
def fs_rename(request):
    data = json.loads(request.body)
    os.rename(data['from'], data['to'])
    return HttpResponse('')


@login_required
def fs_chmod(request):
    data = json.loads(request.body)
    mods = [
        data['mod_ur'], data['mod_uw'], data['mod_ux'],
        data['mod_gr'], data['mod_gw'], data['mod_gx'],
        data['mod_ar'], data['mod_aw'], data['mod_ax'],
    ]
    mode = sum(
        STAT_BITS[i] * (1 if mods[i] else 0)
        for i in range(0, 9)
    )
    s_mode = '%04o' % mode

    subprocess.call(['chmod', '-R' if data['recursive'] else '-f', s_mode, data['path']])
    return HttpResponse('')


@login_required
def fs_set_affinity(request):
    data = json.loads(request.body)
    subprocess.call(['/usr/cvfs/bin/cvaffinity', '-s', data['affinity'], data['path']])
    return HttpResponse('')
