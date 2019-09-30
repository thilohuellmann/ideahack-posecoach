import http
import json
from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.template import Template, Context
from django.views.decorators.csrf import csrf_exempt

def index(request):
    return render(request, 'boilerplate/index.html', context={})