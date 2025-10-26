# Deployment Guide for Ticcket

## Prerequisites
- PHP 7.4 or higher
- Composer installed on server
- Apache/Nginx web server
- Git installed

## Deployment Steps

### 1. Clone Repository
```bash
cd /var/www/html  # or your web root
git clone https://github.com/DammyCodes-all/hng-stage-2-twig.git
cd hng-stage-2-twig
```

### 2. Install Dependencies
```bash
composer install --no-dev --optimize-autoloader
```

### 3. Configure for Production

#### A. Update config.php
```bash
cp config.production.php config.php
```

Then edit `config.php` and set:
- `base_path` to `''` (empty string for root domain)
- `debug` to `false`
- Enable Twig cache

#### B. Update JavaScript Config
Edit `public/assets/js/config.js`:
```javascript
export const BASE_PATH = ''; // Empty for root domain
```

### 4. Set Permissions
```bash
# Make cache directory writable
mkdir -p cache
chmod 755 cache

# Make data directory writable (if using file-based storage)
mkdir -p public/data
chmod 755 public/data
```

### 5. Configure Web Server

#### Apache (.htaccess already configured)
The `.htaccess` file in `/public` is already set up for clean URLs.

Make sure your Apache config allows `.htaccess` overrides:
```apache
<Directory /var/www/html/hng-stage-2-twig/public>
    AllowOverride All
    Require all granted
</Directory>
```

#### Nginx Configuration
If using Nginx, create this server block:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    root /var/www/html/hng-stage-2-twig/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.ht {
        deny all;
    }
}
```

### 6. Point Domain to Public Directory
Your web server document root should point to `/public` directory:
```
/var/www/html/hng-stage-2-twig/public
```

### 7. Test Deployment
Visit your domain and test:
- ✅ Home page loads
- ✅ Authentication works (signup/login)
- ✅ Dashboard displays stats
- ✅ Tickets CRUD operations
- ✅ Clean URLs work (no `.php` extension)

## Environment-Specific Configuration

### Local Development (XAMPP)
- `base_path`: `/hng-stage-2-twig/public`
- `debug`: `true`
- `twig_cache`: `false`

### Production
- `base_path`: `''` (empty)
- `debug`: `false`
- `twig_cache`: enabled

## Post-Deployment Checklist

- [ ] Composer dependencies installed
- [ ] Config.php updated for production
- [ ] JavaScript config.js updated
- [ ] File permissions set correctly
- [ ] Web server configured
- [ ] Clean URLs working
- [ ] All pages accessible
- [ ] CRUD operations functional
- [ ] Twig cache enabled
- [ ] Debug mode disabled

## Updating/Redeploying

```bash
cd /var/www/html/hng-stage-2-twig
git pull origin main
composer install --no-dev --optimize-autoloader
# Clear Twig cache if needed
rm -rf cache/*
```

## Troubleshooting

### Issue: 404 errors / URLs not working
**Solution**: Check `.htaccess` is present in `/public` and Apache allows overrides

### Issue: Blank pages
**Solution**: Check PHP error logs, enable debug temporarily in config.php

### Issue: Permission denied errors
**Solution**: Ensure web server user has write access to `cache/` and `data/` directories

### Issue: Vendor directory not found
**Solution**: Run `composer install` on the server

## Database Migration (Future Enhancement)

Currently using file-based storage (`public/data/tickets.json`).

For production, consider migrating to MySQL/PostgreSQL:
1. Create database
2. Update API to use PDO/database instead of JSON files
3. Add database credentials to config.php

## Security Notes

- ✅ Never commit `vendor/` directory
- ✅ Keep `composer.lock` out of production (ignore it)
- ✅ Set `debug` to `false` in production
- ✅ Enable Twig cache in production
- ✅ Secure `data/` directory permissions
- ✅ Use HTTPS in production (set up SSL certificate)
- ⚠️ Consider implementing CSRF tokens for forms
- ⚠️ Add rate limiting for authentication endpoints

## Support

For issues or questions, contact the development team or create an issue on GitHub.
