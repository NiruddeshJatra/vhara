# Generated by Django 5.1.4 on 2025-01-11 06:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('advertisements', '0005_alter_product_options_product_category_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='product',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
