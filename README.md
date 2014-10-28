Deps:

  * ``apt-get install npm python-virtualenv python-pip libmysqlclient-dev``
  * ``npm install -g coffee-script less bower``

Setup:

    virtualenv env
    . env/bin/activate
    pip install -r requirements.txt
    ./manage.py syncdb
    ./manage.py migrate

Running:

    . env/bin/activate
    make run

API
---

Parameters are passed in a JSON body

  * ``api/info`` - returns definitions, current user, etc
  * ``api/notifications`` - returns list of notifications
  * ``api/erip/tree`` - fetches and returns ERIP tree from server
  * ``api/pay`` - performs a payment, args: ``client_id, accountId, recipientBank, recipientId, recipientName, recipientAccountId, amount``
  *  ``api/change-password`` - changes the password, args: ``password``

Bank API
--------

Parameters are passed via POST

 * ``bank-api/notify`` - posts a notification, args: ``clientId, content``
