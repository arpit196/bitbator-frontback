# Generated by Django 3.1.7 on 2021-04-18 10:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('collab', '0002_request'),
    ]

    operations = [
        migrations.CreateModel(
            name='LogIn',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=30)),
                ('password', models.CharField(max_length=100)),
            ],
        ),
    ]
