# Generated by Django 2.1.5 on 2019-04-18 07:29

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=30, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=30, unique=True)),
                ('unit', models.CharField(choices=[('g', 'gram'), ('ml', 'milliliter'), ('p', 'piece')], default='g', max_length=2)),
                ('default_quantity', models.PositiveIntegerField(blank=True, null=True)),
                ('selected', models.BooleanField()),
                ('category', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='app.Category')),
            ],
        ),
        migrations.CreateModel(
            name='Purchase',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.PositiveIntegerField()),
                ('cost_rub', models.PositiveIntegerField()),
                ('date', models.DateField()),
                ('comment', models.CharField(blank=True, max_length=255)),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='app.Product')),
            ],
        ),
        migrations.AlterUniqueTogether(
            name='purchase',
            unique_together={('product', 'quantity', 'cost_rub', 'date')},
        ),
    ]
