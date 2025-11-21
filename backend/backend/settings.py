from pathlib import Path

# Base directory
BASE_DIR = Path(__file__).resolve().parent.parent

# ✅ Path to your built React app (from Vite)
REACT_APP_DIST_DIR = BASE_DIR / 'app' / 'dist'

# Security
SECRET_KEY = 'your-secret-key'
DEBUG = True
ALLOWED_HOSTS = ['127.0.0.1', 'localhost']

LOGIN_URL = '/accounts/login/'

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'app',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

# ✅ Templates: Load React's index.html as the root template
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [REACT_APP_DIST_DIR],  # ✅ React index.html lives here
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'React_loan',
          'USER': 'postgres',
        'PASSWORD': 'doge123789',
        'HOST': 'localhost',  # Use '127.0.0.1' or the database server's IP
        'PORT': '5432', 
    }
}
# CORS settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
CORS_ALLOW_CREDENTIALS = True
CSRF_TRUSTED_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"]

# Session and CSRF cookie settings for cross-origin
SESSION_ENGINE = 'django.contrib.sessions.backends.db'  # Use database-backed sessions
SESSION_COOKIE_SAMESITE = 'Lax'  # Lax works with HTTP
SESSION_COOKIE_HTTPONLY = False  # Set to False for debugging
SESSION_COOKIE_SECURE = False  # False for HTTP development
SESSION_COOKIE_DOMAIN = 'localhost'  # Explicitly set to localhost
SESSION_COOKIE_NAME = 'sessionid'  # Explicit session cookie name
SESSION_SAVE_EVERY_REQUEST = True  # Save session on every request
CSRF_COOKIE_SAMESITE = 'Lax'  # Lax works with HTTP
CSRF_COOKIE_HTTPONLY = False
CSRF_COOKIE_SECURE = False  # False for HTTP development
CSRF_COOKIE_DOMAIN = 'localhost'  # Explicitly set to localhost

# REST Framework settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
    ],
}


# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Localization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# ✅ Static files (React assets from Vite)
STATIC_URL = '/assets/'  # Match this with your Vite config base

# Serve React's built assets from /dist/assets
STATICFILES_DIRS = [
    REACT_APP_DIST_DIR / 'assets',
]

STATIC_ROOT = BASE_DIR / 'staticfiles'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
