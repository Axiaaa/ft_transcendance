# Utiliser l'image Python 3.12 comme base
FROM python:3.12-slim

# Définir le répertoire de travail
WORKDIR /app

RUN sleep 5
# Copier les dépendances et les installer
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copier les fichiers du projet
COPY . /app/

# Exposer le port pour Django
EXPOSE 8000

# Utiliser wait-for-it.sh pour attendre que PostgreSQL soit prêt avant de lancer Django
CMD ["sh", "-c",    "python manage.py migrate && \ 
                    python manage.py createsuperuser --noinput && \ 
                    python manage.py runserver 0.0.0.0:8000"]
