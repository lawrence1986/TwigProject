# Use official PHP image with Apache
FROM php:8.2-apache

# Copy project files to web root
COPY . /var/www/html/

# Enable Apache mod_rewrite (needed by frameworks)
RUN a2enmod rewrite

# Expose port 80
EXPOSE 80

# Start Apache in the foreground
CMD ["apache2-foreground"]
