from django.urls import path, re_path
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static

from .views import (
    index, signup_api_view, login_api_view, logout_api_view,
    get_user_role, get_csrf_token, admin_dashboard_api, user_dashboard_api,
    total_customers_api, api_loans, api_pending_loans, api_approved_loans,
    api_rejected_loans, create_loan_category, category_list, category_detail,
    api_all_user_loans, loan_history_api, apply_loan, loan_categories_api,
    process_loan, pay_loan, transaction_history_api
)

urlpatterns = [
    # 🌐 Public/Homepage
    path('', index, name='homepage'),

    # 🔐 Authentication APIs
    path('api/csrf/', get_csrf_token, name='get_csrf_token'),
    path('api/signup/', signup_api_view, name='signup_api'),
    path('api/login/', login_api_view, name='login_api'),
    path('api/logout/', logout_api_view, name='logout_api'),

    # 👤 User Info
    path('api/user/', get_user_role, name='get_user'),

    # 📊 Dashboards
    path('api/admin-dashboard/', admin_dashboard_api, name='admin_dashboard_api'),
    path('api/user-dashboard/', user_dashboard_api, name='user_dashboard_api'),

    # 💼 Loan APIs for Users
    path('api/loan-history/', loan_history_api, name='loan_history_api'),
    path('api/pay-loan/<int:loan_id>/', pay_loan, name='pay_loan'),
    path('api/apply-loan/', apply_loan, name='apply_loan'),  # used only if form-based fallback exists
    path('api/loan-categories/', loan_categories_api, name='loan_categories_api'),
    path('api/transaction-history/', transaction_history_api, name='transaction_history_api'),

    # 🛡️ Admin APIs
    path('api/admin/customers/', total_customers_api, name='total_customers_api'),
    path('api/loans/', api_loans, name='api_loans'),
    path('api/pending-loans/', api_pending_loans, name='api_pending_loans'),
    path('api/approved-loans/', api_approved_loans, name='api_approved_loans'),
    path('api/rejected-loans/', api_rejected_loans, name='api_rejected_loans'),
    path('api/user-loans/', api_all_user_loans, name='api_all_user_loans'),
    path('api/create-category/', create_loan_category, name='create_category_api'),
    path('api/categories/', category_list, name='category_list_api'),
    path('api/categories/<int:category_id>/', category_detail, name='category_detail_api'),
    path('api/process-loan/<int:loan_id>/<str:action>/', process_loan, name='process_loan'),
]

# 🧾 Serve static files (for dev only)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])

# ⚛️ React Frontend Fallback Routes
urlpatterns += [
    # Admin React Fallback
    re_path(
        r'^custom-admin/(?!api/|assets/).*$', 
        TemplateView.as_view(template_name="index.html"), 
        name="react_admin_frontend"
    ),
    # Main React Frontend Fallback
    re_path(
        r'^(?!api/|admin/|custom-admin/|assets/).*$', 
        TemplateView.as_view(template_name="index.html"), 
        name="react_frontend"
    ),
]
