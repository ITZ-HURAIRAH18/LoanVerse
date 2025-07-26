from django.db import models
from django.contrib.auth.models import User

# 1. User Profile (if you want to extend user details)
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=15, unique=True)  # Ensure unique phone numbers
    address = models.TextField(blank=True)

    def __str__(self):
        return self.user.username

# 2. Loan Category
class LoanCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)  # Ensure unique category names
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

from decimal import Decimal

class LoanRequest(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey('LoanCategory', on_delete=models.SET_NULL, null=True)
    reason = models.TextField()
    request_amount = models.DecimalField(max_digits=12, decimal_places=2)
    term_years = models.PositiveIntegerField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Pending')
    request_date = models.DateTimeField(auto_now_add=True)
    approved_date = models.DateTimeField(null=True, blank=True)
    total_approved_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    is_paid = models.BooleanField(default=False)

    def __str__(self):
        return f"Loan #{self.id} - {self.user.username}"

    @property
    def interest_amount(self):
        interest_rate = Decimal('0.08')  # 8%
        return (self.request_amount * interest_rate * self.term_years).quantize(Decimal('0.01'))

    @property
    def total_with_interest(self):
        return (self.request_amount + self.interest_amount).quantize(Decimal('0.01'))


# 4. Loan Transaction
class LoanTransaction(models.Model):
    loan_request = models.ForeignKey(LoanRequest, on_delete=models.CASCADE, related_name='transactions')
    amount_paid = models.DecimalField(max_digits=12, decimal_places=2)
    payment_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=[('Paid', 'Paid'), ('Due', 'Due')], default='Paid')

    def __str__(self):
        return f"Payment of {self.amount_paid} on {self.payment_date}"

# 5. Optional: Repayment Summary (or calculate dynamically in views)
class RepaymentSummary(models.Model):
    loan_request = models.OneToOneField(LoanRequest, on_delete=models.CASCADE)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    total_paid = models.DecimalField(max_digits=12, decimal_places=2)
    total_due = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f"Summary for Loan #{self.loan_request.id}"
