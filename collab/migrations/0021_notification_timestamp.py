# Generated by Django 3.1.7 on 2021-07-27 17:15

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('collab', '0020_auto_20210722_2258'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='timestamp',
            field=models.DateTimeField(default=datetime.datetime(2021, 1, 1, 12, 10, 6)),
        ),
    ]