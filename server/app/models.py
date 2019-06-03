from django.db import models
from django.db.models.deletion import DO_NOTHING

# Create your models here.

class Category(models.Model):
    name = models.CharField(max_length = 30, unique=True)
    def __str__(self):
        return self.name 

class Product(models.Model):
    name = models.CharField(max_length = 30, unique=True)
    category = models.ForeignKey(Category, on_delete=DO_NOTHING, null = True)
    units = ( ('g', 'gram'), ('ml', 'milliliter'), ('p','piece'))
    unit = models.CharField(max_length=2,choices=units, default = 'g')
    default_quantity = models.PositiveIntegerField(null=True, blank=True)

    def __str__(self):
        if self.category == None:
            return self.name + ', ' + self.unit
        else:
            return self.category.__str__() + ': ' + self.name + ', ' + self.unit
    
class Purchase(models.Model):
    product = models.ForeignKey(Product, on_delete=DO_NOTHING)
    quantity = models.PositiveIntegerField()
    cost_rub = models.PositiveIntegerField()
    date = models.DateField()
    comment = models.CharField(max_length = 255, blank = True)
    class Meta:
        unique_together = ("product", "quantity","cost_rub","date")
