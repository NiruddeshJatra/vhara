# Generated by Django 5.1.4 on 2025-02-12 10:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0010_alter_customuser_email'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='is_trusted',
            field=models.BooleanField(default=False),
        ),
    ]
