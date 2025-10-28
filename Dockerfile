# Use official PHP image with Apache
FROM php:8.2-apache

# Install dependencies
RUN apt-get update && apt-get install -y \
  git \
  unzip \
  && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
ENV COMPOSER_ALLOW_SUPERUSER=1

# Set working directory
WORKDIR /var/www/html

# Copy project files
COPY . /var/www/html/

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress

# Set Apache DocumentRoot to public and enable .htaccess overrides
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/000-default.conf \
  && a2enmod rewrite \
  && printf "<Directory ${APACHE_DOCUMENT_ROOT}>\n    AllowOverride All\n</Directory>\n" > /etc/apache2/conf-available/allow-htaccess.conf \
  && a2enconf allow-htaccess

# Expose Apache port
EXPOSE 80

# Start Apache
CMD ["apache2-foreground"]