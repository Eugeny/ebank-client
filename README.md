Deps:

  * ``apt-get install npm python-virtualenv python-pip``
  * ``npm install -g coffee-script less``

Setup:

    virtualenv env
    pip install -r requirements.txt
    . env/bin/activate
    ./manage.py syncdb
    ./manage.py migrate

Running:

    . env/bin/activate
    make run