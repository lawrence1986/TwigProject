import { login, signup } from '../utils/auth.js';
import { showSuccess, showError } from '../utils/toast.js';
import { refreshNavbar } from '../utils/navbar.js';
import { url } from '../config.js';

document.addEventListener('DOMContentLoaded', () => {
  const authForm = document.getElementById('authForm');
  const toggleModeBtn = document.getElementById('toggleModeBtn');
  const authModeInput = document.getElementById('authMode');
  const nameField = document.getElementById('nameField');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const submitBtn = document.getElementById('submitBtn');
  const submitBtnText = document.getElementById('submitBtnText');
  const authTitle = document.getElementById('authTitle');
  const authSubtitle = document.getElementById('authSubtitle');

  let currentMode = authModeInput.value;

  // Toggle between login and signup
  toggleModeBtn.addEventListener('click', () => {
    currentMode = currentMode === 'login' ? 'signup' : 'login';
    updateUI();
    clearErrors();
    clearForm();
    
    // Update URL without reload using base-aware helper
    const newUrl = currentMode === 'login' ? url('auth/login') : url('auth/signup');
    window.history.pushState({}, '', newUrl);
  });

  function updateUI() {
    if (currentMode === 'signup') {
      authTitle.textContent = 'Create Account';
      authSubtitle.textContent = 'Sign up to start managing your tickets';
      nameField.style.display = '';
      submitBtnText.textContent = 'Sign Up';
      toggleModeBtn.textContent = 'Already have an account? Login';
    } else {
      authTitle.textContent = 'Welcome Back';
      authSubtitle.textContent = 'Enter your credentials to access your account';
      nameField.style.display = 'none';
      submitBtnText.textContent = 'Login';
      toggleModeBtn.textContent = "Don't have an account? Sign up";
    }
  }

  function clearForm() {
    nameInput.value = '';
    emailInput.value = '';
    passwordInput.value = '';
  }

  function clearErrors() {
    const errors = ['nameError', 'emailError', 'passwordError'];
    errors.forEach(errorId => {
      const errorEl = document.getElementById(errorId);
      errorEl.textContent = '';
      errorEl.classList.add('hidden');
    });

    // Remove error borders
    nameInput.classList.remove('border-red-500');
    emailInput.classList.remove('border-red-500');
    passwordInput.classList.remove('border-red-500');
  }

  function showFieldError(field, message) {
    const errorEl = document.getElementById(`${field}Error`);
    const inputEl = document.getElementById(field);
    
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
    inputEl.classList.add('border-red-500');
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function validateForm() {
    clearErrors();
    let isValid = true;

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const name = nameInput.value.trim();

    // Validate name (only for signup)
    if (currentMode === 'signup' && !name) {
      showFieldError('name', 'Name is required');
      isValid = false;
    }

    // Validate email
    if (!email) {
      showFieldError('email', 'Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      showFieldError('email', 'Please enter a valid email');
      isValid = false;
    }

    // Validate password
    if (!password) {
      showFieldError('password', 'Password is required');
      isValid = false;
    } else if (password.length < 6) {
      showFieldError('password', 'Password must be at least 6 characters');
      isValid = false;
    }

    return isValid;
  }

  function setLoading(loading) {
    submitBtn.disabled = loading;
    if (loading) {
      submitBtnText.textContent = 'Please wait...';
      submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
      submitBtnText.textContent = currentMode === 'signup' ? 'Sign Up' : 'Login';
      submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
  }

  // Handle form submission
  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const name = nameInput.value.trim();

    setLoading(true);

    try {
      if (currentMode === 'login') {
        await login(email, password);
        showSuccess("Welcome back! You're all set.");
      } else {
        await signup(name, email, password);
        showSuccess("Account created successfully! You're now signed in.");
      }
      
      // Refresh navbar to show authenticated state
      refreshNavbar();
      
      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = url('dashboard');
      }, 500);
    } catch (error) {
      const message = error.message || 'Something went wrong. Please try again.';
      showError(message);
    } finally {
      setLoading(false);
    }
  });

  // Redirect if already authenticated
  import('../utils/auth.js').then(({ redirectIfAuthenticated }) => {
    redirectIfAuthenticated(url('dashboard'));
  });
});