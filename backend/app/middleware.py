class AuthDebugMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Log authentication details
        print(f"\n=== Request: {request.method} {request.path} ===")
        print(f"User: {request.user}")
        print(f"Is authenticated: {request.user.is_authenticated if hasattr(request.user, 'is_authenticated') else 'N/A'}")
        print(f"Session key: {request.session.session_key if hasattr(request, 'session') else 'N/A'}")
        print(f"Cookies: {list(request.COOKIES.keys())}")
        
        response = self.get_response(request)
        return response
