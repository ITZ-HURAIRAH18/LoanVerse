from django.shortcuts import render, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.admin.views.decorators import staff_member_required
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.views.decorators.http import require_GET
from django.http import JsonResponse
from django.db.models import Sum

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status

from decimal import Decimal
import json

from .models import LoanRequest, LoanTransaction, LoanCategory
from django.contrib.auth.models import User
from .serializers import CustomUserCreationSerializer


def is_admin(user):
    return user.is_staff


def index(request):
    return render(request, 'index.html')


from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import CustomUserCreationSerializer

from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .serializers import CustomUserCreationSerializer

from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt  # only for testing — not recommended for production
@api_view(['POST'])
@permission_classes([AllowAny])
def signup_api_view(request):
    serializer = CustomUserCreationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Signup successful"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def login_api_view(request):
    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return Response({
            "message": "Login successful",
            "username": user.username,
            "is_staff": user.is_staff,
            "role": "admin" if user.is_staff else "user"
        })
    return Response({"error": "Invalid username or password"}, status=401)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_api_view(request):
    logout(request)
    return Response({"message": "Logout successful"})


@api_view(['GET'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def get_csrf_token(request):
    """Endpoint to get CSRF token"""
    return Response({"detail": "CSRF cookie set"})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_role(request):
    user = request.user
    return Response({
        "username": user.username,
        "is_staff": user.is_staff,
        "role": "admin" if user.is_staff else "user"
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_dashboard_api(request):
    if not request.user.is_staff:
        return Response({"error": "Unauthorized"}, status=403)
    try:
        total_customers = User.objects.filter(is_staff=False).count()
        pending_loans = LoanRequest.objects.filter(status='Pending').count()
        approved_loans = LoanRequest.objects.filter(status='Approved').count()
        rejected_loans = LoanRequest.objects.filter(status='Rejected').count()

        total_approved_amount = LoanRequest.objects.filter(status='Approved').aggregate(total=Sum('request_amount'))['total']
        total_paid = LoanTransaction.objects.aggregate(total=Sum('amount_paid'))['total']

        total_approved_amount = float(total_approved_amount) if total_approved_amount else 0.0
        total_paid = float(total_paid) if total_paid else 0.0
        total_due = total_approved_amount - total_paid

        stats = [
            {"key": "users", "title": "Total Customers", "value": total_customers, "color_class": "text-blue-600"},
            {"key": "pending", "title": "Pending Loans", "value": pending_loans, "color_class": "text-yellow-500"},
            {"key": "approved", "title": "Approved Loans", "value": approved_loans, "color_class": "text-green-600"},
            {"key": "rejected", "title": "Rejected Loans", "value": rejected_loans, "color_class": "text-red-500"},
            {"key": "approved_amount", "title": "Total Approved Amount", "value": total_approved_amount, "color_class": "text-cyan-600"},
            {"key": "paid", "title": "Total Paid Amount", "value": total_paid, "color_class": "text-green-700"},
            {"key": "unpaid", "title": "Total Due Amount", "value": total_due, "color_class": "text-red-600"},
        ]
        return Response({"stats": stats})
    except Exception as e:
        return Response({"error": "Server error"}, status=500)

from django.contrib.auth.models import User
from django.http import JsonResponse

def total_customers_api(request):
    customers = User.objects.filter(is_staff=False).values('id', 'username', 'email')
    return JsonResponse({'customers': list(customers)})
@login_required
@user_passes_test(is_admin)
def process_loan(request, loan_id, action):
    loan = get_object_or_404(LoanRequest, id=loan_id, status='Pending')
    if action == "approve":
        loan.status = "Approved"
        loan.total_approved_amount = loan.request_amount  # ✅ Set approved amount
    elif action == "reject":
        loan.status = "Rejected"
    loan.save()
    return JsonResponse({"success": True, "status": loan.status})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_loans(request):
    if not request.user.is_staff:
        return Response({"error": "Forbidden: Admin access only"}, status=403)
    try:
        loans = LoanRequest.objects.select_related('user', 'category').all()
        data = [
            {
                "id": loan.id,
                "username": loan.user.username,
                "category": loan.category.name if loan.category else "N/A",
                "amount": float(loan.request_amount),
                "status": loan.status,
                "date": loan.request_date.strftime('%Y-%m-%d'),
            } for loan in loans
        ]
        return Response({"loans": data})
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_approved_loans(request):
    if not request.user.is_staff:
        return Response({"error": "Forbidden"}, status=403)

    loans = LoanRequest.objects.filter(status='Approved').select_related('user', 'category')
    data = [
        {
            "id": loan.id,
            "user": loan.user.username,
            "category": loan.category.name if loan.category else "N/A",
            "total_approved_amount": float(loan.request_amount),
            "approved_date": loan.request_date.strftime('%Y-%m-%d')
        } for loan in loans
    ]
    return Response({'loans': data})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_pending_loans(request):
    if not request.user.is_staff:
        return Response({"error": "Forbidden"}, status=403)

    loans = LoanRequest.objects.filter(status='Pending').select_related('user', 'category')
    data = [
        {
            "id": loan.id,
            "user": loan.user.username,
            "category": loan.category.name if loan.category else "N/A",
            "amount": float(loan.request_amount),
            "requested_date": loan.request_date.strftime('%Y-%m-%d')
        } for loan in loans
    ]
    return Response({'loans': data})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_rejected_loans(request):
    if not request.user.is_staff:
        return Response({"error": "Forbidden"}, status=403)

    loans = LoanRequest.objects.filter(status='Rejected').select_related('user', 'category')
    data = [
        {
            "id": loan.id,
            "user": loan.user.username,
            "category": loan.category.name if loan.category else "N/A",
            "amount": float(loan.request_amount),
            "requested_date": loan.request_date.strftime('%Y-%m-%d')
        } for loan in loans
    ]
    return Response({'loans': data})



@staff_member_required
def api_all_user_loans(request):
    loans = LoanRequest.objects.select_related('user', 'category').prefetch_related('transactions')
    data = []
    for loan in loans:
        total_paid = loan.transactions.aggregate(total=Sum('amount_paid'))['total'] or 0
        if loan.status == 'Rejected':
            status = 'Rejected'
        elif loan.status == 'Pending':
            status = 'Pending'
        elif total_paid >= loan.total_approved_amount:
            status = 'Paid'
        else:
            status = 'Unpaid'

        data.append({
            'id': loan.id,
            'username': loan.user.username,
            'category': loan.category.name if loan.category else 'N/A',
            'approved_amount': float(loan.total_approved_amount),
            'term_years': loan.term_years,
            'approved_date': loan.request_date.strftime('%Y-%m-%d'),
            'status': status,
            'transactions': [
                {
                    'amount_paid': float(tx.amount_paid),
                    'payment_date': tx.payment_date.strftime('%Y-%m-%d')
                } for tx in loan.transactions.all()
            ]
        })
    return JsonResponse({'loans': data})



@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def create_loan_category(request):
    name = request.data.get("name")
    description = request.data.get("description")
    if not name:
        return Response({"error": "Name is required"}, status=400)
    category = LoanCategory.objects.create(name=name, description=description)
    return Response({"success": True, "category": {"id": category.id, "name": category.name}})


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def category_list(request):
    categories = LoanCategory.objects.all()
    data = [{"id": c.id, "name": c.name, "description": c.description} for c in categories]
    return Response({"categories": data})


@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([IsAuthenticated, IsAdminUser])
def category_detail(request, category_id):
    try:
        category = LoanCategory.objects.get(id=category_id)
    except LoanCategory.DoesNotExist:
        return Response({"error": "Not found"}, status=404)

    if request.method == "GET":
        return Response({"id": category.id, "name": category.name, "description": category.description})

    elif request.method == "POST":
        category.name = request.data.get("name", category.name)
        category.description = request.data.get("description", category.description)
        category.save()
        return Response({"success": True})

    elif request.method == "DELETE":
        category.delete()
        return Response({"success": True}, status=204)

    elif request.method == "DELETE":
        category.delete()
        return JsonResponse({"success": True, "message": "Category deleted"})

    return JsonResponse({"error": "Method not allowed"}, status=405)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def pay_loan(request, loan_id):
    try:
        loan = LoanRequest.objects.get(id=loan_id, user=request.user)
        LoanTransaction.objects.create(
            loan_request=loan,
            amount_paid=request.data["amount"],
            status="Paid"
        )
        loan.is_paid = True
        loan.save()
        return Response({"status": "success"})
    except Exception as e:
        return Response({"error": str(e)}, status=400)


from decimal import Decimal

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def loan_history_api(request):
    loans = LoanRequest.objects.filter(user=request.user).select_related('category').prefetch_related('transactions')
    data = []
    for loan in loans:
        total_paid = loan.transactions.aggregate(total=Sum('amount_paid'))['total'] or 0

        # Calculate interest and total
        interest_rate = Decimal("0.08")  # 8% per year
        interest_amount = (loan.request_amount * interest_rate * loan.term_years).quantize(Decimal("0.01"))
        total_with_interest = (loan.request_amount + interest_amount).quantize(Decimal("0.01"))

        data.append({
            'id': loan.id,
            'category': {'name': loan.category.name if loan.category else 'N/A'},
            'request_amount': float(loan.request_amount),
            'term_years': loan.term_years,
            'interest_amount': float(interest_amount),
            'total_with_interest': float(total_with_interest),
            'status': loan.status,
            'request_date': loan.request_date.strftime('%Y-%m-%d'),
            'is_fully_paid': total_paid >= total_with_interest
        })
    return Response(data)


@csrf_exempt
@login_required
def transaction_history_api(request):
    if request.method == "GET":
        try:
            transactions = LoanTransaction.objects.filter(loan_request__user=request.user)
            data = [
                {
                    "id": tx.id,
                    "loan_id": tx.loan_request.id if tx.loan_request else None,
                    "amount_paid": float(tx.amount_paid),
                    "status": tx.status,
                    "paid_on": tx.payment_date.strftime('%Y-%m-%d %H:%M')
                } for tx in transactions
            ]
            return JsonResponse({"transactions": data})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "GET method required"}, status=400)


@api_view(['GET'])
def loan_categories_api(request):
    categories = LoanCategory.objects.all()
    data = [{"id": cat.id, "name": cat.name} for cat in categories]
    return Response(data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_loan(request):
    try:
        data = request.data
        category = LoanCategory.objects.get(id=data['category'])
        LoanRequest.objects.create(
            user=request.user,
            category=category,
            reason=data['reason'],
            request_amount=data['amount'],
            term_years=data['term_years'],
            status='Pending'
        )
        return Response({"success": True, "message": "Loan request submitted."}, status=201)
    except Exception as e:
        return Response({"success": False, "message": str(e)}, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_dashboard_api(request):
    user = request.user
    total_requests = LoanRequest.objects.filter(user=user).count()
    approved = LoanRequest.objects.filter(user=user, status='Approved').count()
    rejected = LoanRequest.objects.filter(user=user, status='Rejected').count()
    total_approved_amount = LoanRequest.objects.filter(user=user, status='Approved').aggregate(Sum('request_amount'))['request_amount__sum'] or Decimal('0.00')
    total_paid = LoanTransaction.objects.filter(loan_request__user=user).aggregate(Sum('amount_paid'))['amount_paid__sum'] or Decimal('0.00')
    total_due = total_approved_amount - Decimal(total_paid)
    user_stats = [
        {'title': 'Total Loan Requests', 'value': total_requests, 'color_class': 'text-blue-400'},
        {'title': 'Approved', 'value': approved, 'color_class': 'text-green-400'},
        {'title': 'Rejected', 'value': rejected, 'color_class': 'text-red-400'},
        {'title': 'Total Approved Amount', 'value': f'₹{total_approved_amount}', 'color_class': 'text-cyan-400'},
        {'title': 'Total Paid', 'value': f'₹{total_paid}', 'color_class': 'text-green-400'},
        {'title': 'Total Due', 'value': f'₹{total_due}', 'color_class': 'text-yellow-400'},
    ]
    return Response({"user_stats": user_stats, "first_name": user.first_name, "username": user.username})
