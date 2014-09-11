Setup:

    virtualenv env
    pip install -r requirements.txt
    source env/bin/activate
    ./manage.py syncdb
    make migrate


Running:

    source env/bin/activate
    make run