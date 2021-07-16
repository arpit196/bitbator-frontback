release: python manage.py migrate
web: npm start --log-file -
pyapi: gunicorn collab.wsgi --log-file -
