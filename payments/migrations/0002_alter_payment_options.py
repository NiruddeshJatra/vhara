# Generated by Django 5.1.4 on 2025-01-14 18:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='payment',
            options={'ordering': ['-created_at'], 'verbose_name': 'Payment', 'verbose_name_plural': 'Payments'},
        ),
    ]
