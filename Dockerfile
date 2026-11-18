# ============================================================================
# PRODUCTION DOCKERFILE — 3D AI & FULL-STACK PORTFOLIO
# ============================================================================
FROM nginx:1.27-alpine

LABEL maintainer="AI & Full-Stack Portfolio"
LABEL description="Zero-bloat 3D WebGL Portfolio served via optimized Nginx Alpine"

# Copy custom Nginx configuration (Gzip, Security Headers, /healthz endpoint)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static 3D portfolio assets
COPY index.html /usr/share/nginx/html/index.html
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/

EXPOSE 80

# Built-in container healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
