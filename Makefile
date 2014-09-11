ENV=dev

migrate:
	./manage.py schemamigration main --auto || true
	./manage.py migrate --all

build:
	rm -rf static/CACHE
	./manage.py compress --force --settings=config.environments.$(ENV)

static: build
	rm -rf public/static/*
	./manage.py collectstatic --noinput -l --settings=config.environments.$(ENV)

run:
	./manage.py runserver 0.0.0.0:8080
	
clean:
	find . -name '*.pyc' -delete
	
.PHONY: build static


