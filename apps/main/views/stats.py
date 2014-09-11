import json
import os
import subprocess
import psutil
import re
import time

from django.contrib.auth.decorators import login_required
from django.conf import settings
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, get_object_or_404


last_info = {
    'disk_in': 0,
    'disk_out': 0,
    'time': 0,
}


def stats(request):
    dt = time.time() - last_info['time']

    v = psutil.virtual_memory()

    s = psutil.disk_io_counters()
    read_bytes = s.read_bytes - last_info['disk_in']
    write_bytes = s.write_bytes - last_info['disk_out']

    try:
        ui_version = subprocess.check_output(['/usr/bin/git', 'describe', '--tags'], cwd='/srv/elements-web', stderr=subprocess.PIPE).strip()
    except:
        ui_version = 'none'

    try:
        plugin_version = subprocess.check_output(['/usr/bin/git', 'describe', '--always'], cwd='/var/lib/ajenti/plugins', stderr=subprocess.PIPE).strip()
    except:
        plugin_version = 'none'

    resp = {
        'type': 'stats:data',
        'data': {
            'cpu': psutil.cpu_percent(interval=0),
            'ram': int(100 * (v.total - v.available) / v.total),
            'ram_b': v.total - v.available,
            'disk_din': int(read_bytes / dt),
            'disk_dout': int(write_bytes / dt),
            'disk_in': s.read_bytes,
            'disk_out': s.write_bytes,
            'kernel': subprocess.check_output(['/bin/uname', '-r']).strip(),
            'ui_version': ui_version,
            'plugin_version': plugin_version,
        }
    }

    last_info['disk_in'] = s.read_bytes
    last_info['disk_out'] = s.write_bytes
    last_info['time'] = time.time()

    return HttpResponse(json.dumps(resp))