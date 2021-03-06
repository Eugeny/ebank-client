from datetime import datetime
import json
import os
import subprocess
import tempfile

from django.conf import settings
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.template import loader

from libs.bank import BankApi, BankServerError



def index(request):
    return render(
        request,
        'main/index.html',
        {}
    )

def javascript_disabled(request):
    return render(
        request,
        'main/javascript-disabled.html',
        {}
    )


def template(request, template_name=None):
    t, o = loader.find_template('partial/' + template_name)
    if t:
        return HttpResponse(open(t.origin.name).read())
    else:
        return Http404()


def report(request, account_id=None, date_from=None, date_to=None, type=None, format=None):
    client_id = request.session.get('client-id', None)
    if not client_id:
        raise Http404()
    
    account = None
    client = BankApi().get_client(client_id)['response']
    for x in client['accounts']:
        if x['id'] == int(account_id):
            account = x
            break
    else:
        raise Http404()

    currency = None
    for x in BankApi().get_currency_rates()['response']:
        if x['id'] == account['currency']:
            currency = x

    report = BankApi().payment_report(account_id, date_from, date_to, type)['response']
    eripTree = BankApi().get_erip_tree()['response']['categories']
    for payment in report:
        if format != 'csv':
            payment['processedAt'] = datetime.utcfromtimestamp(payment['processedAt'])
        if 'capitalizationRate' in payment['paymentInfo']:
            payment['paymentInfo']['capitalizationRate'] *= 100
        if 'eripPaymentId' in payment:
            id = payment['eripPaymentId']
            for cat in eripTree.values():
                for p in cat['payments']:
                    if p['paymentId'] == id:
                        payment['eripPaymentName'] = p['name'][request.COOKIES['django_language']]
                        for k in payment['paymentInfo']['fields']:
                            payment['paymentInfo']['fields'][p['fields'][k]['name'][request.COOKIES['django_language']]] = payment['paymentInfo']['fields'].pop(k)

    context = {
        'client': client,
        'account': account,
        'currency': currency,
        'payments': report,
    }

    if format == 'html':
        return render(
            request,
            'main/reports/report.html',
            context,
        )

    if format == 'csv':
        return render(
            request,
            'main/reports/report.csv',
            context,
            content_type='text/plain',
        )

    if format == 'pdf':
        html = render(
            request,
            'main/reports/report.html',
            context,
        ).content

        tmp = tempfile.NamedTemporaryFile(delete=False, suffix='.html')
        tmp.write(html)
        tmp.close()

        proc = subprocess.Popen(
            ['bin/wkhtmltopdf-linux-amd64', tmp.name, '/dev/stdout'],
            stdout=subprocess.PIPE,
        )
        pdf, err = proc.communicate(html)

        os.unlink(tmp.name)

        return HttpResponse(pdf, content_type='application/pdf')

    raise Http404()


def template_bundle(request):
    format = '''
        angular.module("templateBundle").run(["$templateCache", function($templateCache) {
          $templateCache.put("%s", %s);
        }]);
    '''

    js = '''
        angular.module("templateBundle", []);
    '''

    for dir_path, dir_names, file_names in os.walk(settings.TEMPLATE_BUNDLER_ROOT):
        for file in file_names:
            path = os.path.join(dir_path, file)
            relative_path = path[len(settings.PROJECT_ROOT):]
            content = open(path).read()
            if path.endswith('.html'):
                js += format % (relative_path, json.dumps(content))

    return HttpResponse(js, content_type='application/javascript')
