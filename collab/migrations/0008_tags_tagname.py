# Generated by Django 3.1.7 on 2021-06-05 11:07

import builtins
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('collab', '0007_user_visible'),
    ]

    operations = [
        migrations.AddField(
            model_name='tags',
            name='tagName',
            field=models.CharField(max_length=200),
            preserve_default=False,
        ),
    ]
