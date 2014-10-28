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
