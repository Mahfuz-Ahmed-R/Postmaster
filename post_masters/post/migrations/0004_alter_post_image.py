# Generated by Django 5.0.6 on 2024-10-04 09:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('post', '0003_rename_content_post_description'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='image',
            field=models.ImageField(default=None, max_length=255, upload_to=''),
        ),
    ]
