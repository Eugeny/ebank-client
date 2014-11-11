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

  * ``api/auth/login`` - args: ``id, password``
  * ``api/auth/logout`` - logs out
  * ``api/info`` - returns definitions, current user, etc
  * ``api/currency`` - returns currency definitions
  * ``api/notifications`` - returns list of notifications
  * ``api/notification/mark-read`` - marks notification as read, args: ``notificationId``
  * ``api/erip/tree`` - fetches and returns ERIP tree from server
  * ``api/erip/pay`` - performs a payment, args: ``accountId, paymentId, fields (object), amount``
  * ``api/pay`` - performs a payment, args: ``accountId, recipientAccountId, amount``
  * ``api/payment/report`` - returns report, args: ``accountId, dateFrom(opt), dateTo(opt), type(opt)=(erip|payment)``
  *  ``api/change-password`` - changes the password, args: ``client_id_to_change, old_password, new_password``

Bank API
--------

Parameters are passed via POST

 * ``bank-api/notify`` - posts a notification, args: ``clientId, content``
