from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.shortcuts import render
from boilerplate import utils

def index(request):
    return render(request, 'boilerplate/index.html', context={})


@api_view(['POST'])
@permission_classes([AllowAny])
def predict(request):
    transformed = utils.transform_data(request.data)
    bad, good = utils.predict(transformed)

    if bad > 0.51:
        return Response({'prediction': 'bad'})
    elif good > 0.51:
        return Response({'prediction': 'good'})
    else:
        return Response({'prediction': 'unsure'})