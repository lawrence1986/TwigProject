# TwigProject

# TwigProject

# Ticcket - Ticket Management Web App (Twig Implementation)

A modern ticket management web application built with PHP, Twig templating engine, and vanilla JavaScript. This implementation is part of the HNG Stage 2 Multi-Framework Ticket Web App task.

## 🛠️ Frameworks and Libraries Used

### Backend

- **PHP 8.x** - Server-side scripting language
- **Twig 3.x** - Flexible, fast, and secure template engine for PHP
- **Composer** - Dependency management for PHP

### Frontend

- **Tailwind CSS** - Utility-first CSS framework (via CDN)
- **Vanilla JavaScript (ES6+)** - Modern JavaScript with modules
- **Toastify.js** - Toast notification library
- **Lucide Icons** - Beautiful & consistent icon toolkit

### Storage

- **JSON File Storage** - Simple file-based data persistence for tickets
- **localStorage** - Client-side session management

## 📋 Prerequisites

- **PHP 8.0 or higher** installed
- **Composer** installed
- **Web server** (Apache/XAMPP/WAMP) or PHP built-in server
- Modern web browser with JavaScript enabled

## 🚀 Setup and Installation

### 1. Clone or Download the Project

```bash
cd c:\xampp\htdocs\hng-stage-2-twig
```

### 2. Install Dependencies

```bash
composer install
```

This will install Twig and its dependencies.

### 3. Configure Base Path (if needed)

Edit `config.php` to match your environment:

```php
'base_path' => '/hng-stage-2-twig/public',
```

### 4. Start the Server

**Option A: Using XAMPP/WAMP**

- Ensure Apache is running
- Access the app at: `http://localhost/hng-stage-2-twig/public/`

**Option B: Using PHP Built-in Server**

```bash
cd public
php -S localhost:8000
```

Access at: `http://localhost:8000/`

### 5. Access the Application

Open your browser and navigate to the appropriate URL based on your server setup.

## 📱 Application Structure

### Pages

- **Landing Page** (`/`) - Homepage with hero section and features
- **Authentication** (`/auth/login`, `/auth/signup`) - Login and registration
- **Dashboard** (`/dashboard`) - Overview with ticket statistics
- **Tickets** (`/tickets`) - Full CRUD ticket management

### Project Structure

```
hng-stage-2-twig/
├── config.php                 # Application configuration
├── composer.json             # PHP dependencies
├── public/                   # Public web root
│   ├── index.php            # Main router
│   ├── auth.php             # Auth router
│   ├── api/
│   │   └── tickets.php      # Tickets API endpoint
│   ├── assets/
│   │   ├── index.css        # Custom styles
│   │   └── js/
│   │       ├── config.js    # JS configuration
│   │       ├── pages/       # Page-specific JS
│   │       └── utils/       # Utility functions
│   └── data/
│       └── tickets.json     # Ticket data storage
├── src/
│   └── templates/
│       ├── layouts/
│       │   └── base.twig    # Base layout template
│       ├── pages/           # Page templates
│       └── partials/        # Reusable components
└── vendor/                  # Composer dependencies
```

## 🎨 UI Components and Features

### Layout Components

- **Navbar** - Responsive navigation with auth state
- **Footer** - Consistent footer across all pages
- **Base Layout** - Max-width 1440px, centered on large screens
- **Wavy Hero** - SVG wave background on landing page
- **Decorative Circles** - Blurred circular elements for visual appeal

### Ticket Components

- **Ticket Cards** - Box-style display with status badges
- **Ticket Dialog** - Modal for create/edit operations
- **Delete Confirmation** - Safety dialog for ticket deletion
- **Status Badges** - Color-coded status indicators
  - 🟢 Open - Green (#22c55e)
  - 🟠 In Progress - Amber (#f59e0b)
  - ⚫ Closed - Gray (#9ca3af)

### State Management

- **Authentication State** - Managed via localStorage with key `ticketapp_session`
- **Ticket State** - Fetched from API and stored in memory
- **Form State** - Local component state with validation

## 🔐 Authentication System

### Session Management

- Uses localStorage with key: `ticketapp_session`
- Stores user data including email and name
- Protected routes check for valid session
- Automatic redirect to login if unauthorized

### Test User Credentials

**Pre-registered User:**

- Email: `test@example.com`
- Password: `password123`

**Or create a new account:**

1. Go to `/auth/signup`
2. Fill in name, email, and password
3. Click "Sign Up"
4. Automatically logged in and redirected to dashboard

## ✅ Data Validation Rules

### Ticket Validation

- **Title** - Required, cannot be empty
- **Description** - Required, cannot be empty
- **Status** - Must be one of: `open`, `in-progress`, `closed`

### Authentication Validation

- **Name** - Required for signup
- **Email** - Required, must be valid email format
- **Password** - Required, minimum validation

### Error Feedback

- Inline error messages below form fields
- Toast notifications for success/error actions
- Red borders on invalid inputs

## 🛡️ Error Handling

### Authentication Errors

- "No account found for that email address."
- "Incorrect password. Please try again."
- Email format validation

### Ticket Errors

- "Title is required"
- "Description is required"
- "Invalid status"
- "Failed to load tickets"
- "Failed to save ticket"

### Authorization Errors

- Unauthorized access redirects to `/auth/login`
- Session expiry handling

## ♿ Accessibility Features

- Semantic HTML5 elements (`<main>`, `<nav>`, `<footer>`, etc.)
- Proper heading hierarchy (`<h1>` to `<h3>`)
- ARIA labels where appropriate
- Keyboard navigation support
- Focus states on interactive elements
- Sufficient color contrast ratios
- Responsive font sizes and touch targets

## 📱 Responsive Design

### Breakpoints

- **Mobile** - < 640px (stacked layout)
- **Tablet** - 640px - 1024px (2-column grid)
- **Desktop** - > 1024px (3-column grid, max-width 1440px)

### Mobile Features

- Hamburger menu (if implemented)
- Stacked form layouts
- Single-column ticket grid
- Touch-friendly buttons (min 44px)

## 🐛 Known Issues and Limitations

1. **File-based Storage** - Tickets stored in JSON file; not suitable for production
2. **No Real Authentication** - Uses localStorage; vulnerable to XSS attacks
3. **No Password Hashing** - Passwords stored in plain text in localStorage
4. **No Pagination** - All tickets loaded at once; performance issues with many tickets
5. **No Search/Filter** - No ability to search or filter tickets
6. **Session Persistence** - Sessions don't persist across browsers/devices

## 🔄 Switching Between Implementations

This is the **Twig/PHP** implementation. Other implementations (React, Vue.js) should be in separate repositories or folders:

- **React Version**: `https://github.com/DammyCodes-all/hng-stage-2-react/`
- **Vue.js Version**: `https://github.com/DammyCodes-all/hng-stage-2-vue/`
- **Twig Version**: `https://github.com/DammyCodes-all/hng-stage-2-twig/` (this project)

Each implementation is standalone and can run independently.

## 🧪 Testing the Application

### Manual Testing Checklist

1. **Landing Page**

   - [ ] Hero section displays correctly
   - [ ] Wavy background visible
   - [ ] Login and Get Started buttons work
   - [ ] Footer present

2. **Authentication**

   - [ ] Can create new account
   - [ ] Can login with existing credentials
   - [ ] Validation errors display correctly
   - [ ] Toast notifications appear
   - [ ] Redirects to dashboard on success

3. **Dashboard**

   - [ ] Statistics display correctly
   - [ ] Logout button works
   - [ ] Redirects to login when not authenticated
   - [ ] Create ticket button opens dialog

4. **Ticket Management**
   - [ ] Can create new ticket
   - [ ] Can view all tickets
   - [ ] Can edit existing ticket
   - [ ] Can delete ticket (with confirmation)
   - [ ] Status colors correct
   - [ ] Validation works

## 📞 Support and Contact: 08065484243 or send email to: madusquare@gmail.com

For questions about this implementation, refer to the HNG Internship documentation or community channels.

## 📄 License

This project is created for the HNG Stage 2 Internship task.

---
