from rest_framework import serializers
from django.contrib.auth.models import User
from .models import LoanTransaction, LoanCategory, LoanRequest

# ✅ Serializer for LoanTransaction
class LoanTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanTransaction
        fields = '__all__'


# ✅ Serializer for LoanCategory
class LoanCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanCategory
        fields = '__all__'


# ✅ Serializer for user signup (with password validation)
class CustomUserCreationSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'first_name', 'email', 'password1', 'password2')

    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError({"password2": "Passwords do not match."})
        return data

    def create(self, validated_data):
        password = validated_data.pop('password1')
        validated_data.pop('password2')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


# ✅ Serializer for LoanRequest (with optional nested data if needed)
class LoanRequestSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = LoanRequest
        fields = [
            'id', 'user', 'user_username',
            'category', 'category_name',
            'request_amount', 'term_years',
            'status', 'request_date', 'approved_date',
            'total_approved_amount'
        ]
