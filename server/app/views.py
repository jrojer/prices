import json
from django.shortcuts import render
from django.http import HttpResponse
from .models import *


def index(request):
    return render(request,'index.html')


def get(request):
    return HttpResponse(json.dumps({'col 1': 123, 'col_2': 456}))


def add(request):
    response = {'status':'fail'}
    if request.method == 'POST':
        print(json.loads(request.body.decode()))
        response['status'] = 'ok'
    return HttpResponse(json.dumps(response))


def get_product_list(request):
    products = Product.objects.all()
    response = json.dumps({'products': [x for x in products.values()]})
    return HttpResponse(response)


def get_purchase_list(request, offset = 0, count = 10):
    purchases_by_date = []
    curr_date = ''
    for x in Purchase.objects.all().order_by('-date').values():
        date = str(x['date'])
        x['date'] = date
        x['product'] = str(Product.objects.get(id=x.pop('product_id')))
        if date != curr_date:
            purchases_by_date.append({'date':date, 'purchases':[]})
            curr_date = date
        purchases_by_date[-1]['purchases'].append(x)

    response = json.dumps({'status':'ok','purchases_by_date':purchases_by_date[offset:offset+count]})
    return HttpResponse(response)

# single data load
# product list alongside the forms in modal
# synchronization on update
