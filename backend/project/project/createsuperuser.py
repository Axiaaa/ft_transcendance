from django.db import IntegrityError
from django.contrib.auth.models import User
import os

try:
    print(f"Creating Super User with username '{os.getenv('DJANGO_SUPERUSER_USERNAME')}'...")
    superuser = User.objects.create_superuser(
        username=os.getenv('DJANGO_SUPERUSER_USERNAME'),
        email=os.getenv('DJANGO_SUPERUSER_EMAIL'),
        password=os.getenv('DJANGO_SUPERUSER_PASSWORD'))
    superuser.save()
    print(f"Super User with username '{os.getenv('DJANGO_SUPERUSER_USERNAME')}' created successfully!")
except IntegrityError:
    print(f"Super User with username '{os.getenv('DJANGO_SUPERUSER_USERNAME')}' is already exit!")
except Exception as e:
    print(e)