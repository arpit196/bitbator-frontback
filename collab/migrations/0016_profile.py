# Generated by Django 3.1.7 on 2021-06-16 16:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('collab', '0015_discussions'),
    ]

    operations = [
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('username', models.CharField(max_length=100)),
                ('password', models.CharField(max_length=200)),
            ],
        ),
    ]
