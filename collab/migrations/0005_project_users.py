# Generated by Django 3.1.7 on 2021-04-21 15:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('collab', '0004_auto_20210420_2332'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='users',
            field=models.ManyToManyField(to='collab.User'),
        ),
    ]
