# Single stage: Serve pre-built Angular app with Nginx
FROM nginx:alpine

# Copy pre-built app from local dist folder to nginx html directory
COPY dist/larkon/browser /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]