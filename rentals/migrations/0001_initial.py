# Generated by Django 5.1.4 on 2025-01-14 17:41

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('advertisements', '0007_remove_product_price_product_security_deposit_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Rental',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_time', models.DateTimeField(help_text='When renting period starts')),
                ('end_time', models.DateTimeField(help_text='When renting period ends')),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('rejected', 'Rejected'), ('cancelled', 'Cancelled'), ('completed', 'Completed'), ('in_progress', 'In Progress')], default='pending', max_length=50)),
                ('total_price', models.DecimalField(decimal_places=2, editable=False, max_digits=10)),
                ('security_deposit', models.DecimalField(blank=True, decimal_places=2, editable=False, max_digits=10, null=True)),
                ('notes', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='rentals_as_owner', to=settings.AUTH_USER_MODEL)),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='rentals', to='advertisements.product')),
                ('renter', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='rentals_as_renter', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
                'indexes': [models.Index(fields=['status', 'created_at'], name='rentals_ren_status_6cea10_idx'), models.Index(fields=['owner'], name='rentals_ren_owner_i_a6dccf_idx')],
            },
        ),
    ]