FROM python:3.12-slim

RUN mkdir /var/log/django
RUN chown -R www-data:www-data /var/log/django

WORKDIR /app

RUN sleep 5


COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt



COPY . /app/

EXPOSE 8000

CMD ["sh", "-c",    "python manage.py migrate && \ 
                    # python manage.py createsuperuser --noinput && \ 
                    python manage.py runserver 0.0.0.0:8000"]
