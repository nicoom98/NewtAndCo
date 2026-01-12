
from django.shortcuts import render

# Create your views here.
def index(request):

    context = {"color": 1}
    return render(request, 'medailles/medals.html')