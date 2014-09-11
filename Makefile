ENV=dev

migrate:
	./manage.py schemamigration main --auto || true
	./manage.py schemamigration ltfs --auto || true
	./manage.py schemamigration tasks --auto || true
	./manage.py schemamigration media --auto || true
	./manage.py schemamigration tiering --auto || true
	./manage.py migrate --all

build:
	rm -rf static/CACHE
	./manage.py compress --force --settings=config.environments.$(ENV)

static: build
	rm -rf public/static/*
	./manage.py collectstatic --noinput -l --settings=config.environments.$(ENV)

run:
	./manage.py runserver 0.0.0.0:8080

run-celery:
	./manage.py celery worker -E --loglevel=info

run-celerybeat:
	./manage.py celery beat --loglevel=info -S djcelery.schedulers.DatabaseScheduler

run-celerycam:
	./manage.py celery events -F 0.25 -c config.celery.Camera

run-node:
	cd node && node app.js
	
clean:
	find . -name '*.pyc' -delete
	
.PHONY: build static


