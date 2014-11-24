import re
import os

for dp,dn,fn in os.walk('static/main/scripts/app'):
    for f in fn:
        if f.endswith('.html'):
            content = open(dp + '/' + f).read()
            for x in re.findall('gettext\(\'[^\']+\'\)', content):
                print x + ';'