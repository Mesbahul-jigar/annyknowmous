document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');
  const loginForm = document.getElementById('loginForm');
  
  // Signup form handler
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = document.getElementById('submitBtn');
      const errorMessage = document.getElementById('errorMessage');
      
      // Get form values
      const username = document.getElementById('username').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      
      // Clear previous errors
      errorMessage.textContent = '';
      
      // Client-side validation
      if (!/^[a-zA-Z0-9]{3,20}$/.test(username)) {
        errorMessage.textContent = 'Username must be 3-20 alphanumeric characters';
        return;
      }
      
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errorMessage.textContent = 'Please enter a valid email';
        return;
      }
      
      if (password.length < 6) {
        errorMessage.textContent = 'Password must be at least 6 characters';
        return;
      }
      
      // Disable button during request
      submitBtn.disabled = true;
      submitBtn.textContent = 'Creating Account...';
      
      try {
        const response = await fetch('/api/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password })
        });
        
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Signup failed');
        }
        
        // Success - redirect to dashboard
        window.location.href = '/dashboard.html';
        
      } catch (error) {
        errorMessage.textContent = error.message;
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Account';
      }
    });
  }
  
  // Login form handler
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = document.getElementById('submitBtn');
      const errorMessage = document.getElementById('errorMessage');
      
      // Get form values
      const identifier = document.getElementById('identifier').value.trim();
      const password = document.getElementById('password').value;
      
      // Clear previous errors
      errorMessage.textContent = '';
      
      // Basic validation
      if (!identifier || !password) {
        errorMessage.textContent = 'All fields are required';
        return;
      }
      
      // Disable button during request
      submitBtn.disabled = true;
      submitBtn.textContent = 'Logging in...';
      
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier, password })
        });
        
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Login failed');
        }
        
        // Success - redirect to dashboard
        window.location.href = '/dashboard.html';
        
      } catch (error) {
        errorMessage.textContent = error.message;
        submitBtn.disabled = false;
        submitBtn.textContent = 'Login';
      }
    });
  }
});
