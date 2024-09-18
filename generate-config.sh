#!/bin/sh
envsubst '$BACKEND_HOST' &lt; /etc/nginx/conf.d/custom-nginx.template &gt; /etc/nginx/conf.d/default.conf;
exec nginx -g "daemon off;";