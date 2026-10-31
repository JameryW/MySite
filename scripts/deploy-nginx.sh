#!/usr/bin/env bash
#
# Upload deploy/nginx.conf to the production VPS, validate it, back up the
# current config, install it, and reload nginx.
#
#   npm run deploy:nginx
#
# Overridable via env: REMOTE (ssh host alias), NGINX_CONF.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REMOTE="${REMOTE:-jwip}"
NGINX_CONF="${NGINX_CONF:-/etc/nginx/nginx.conf}"
STAMP="$(date +%Y%m%d-%H%M%S)"
REMOTE_TMP="/tmp/nginx.conf.mysite"

cd "$ROOT"

if [ ! -f deploy/nginx.conf ]; then
  echo "deploy/nginx.conf is missing" >&2
  exit 1
fi

echo "==> upload deploy/nginx.conf -> ${REMOTE}:${REMOTE_TMP}"
scp -q deploy/nginx.conf "${REMOTE}:${REMOTE_TMP}"

echo "==> validate, back up, install, reload"
ssh "$REMOTE" "set -e
  nginx -t -c ${REMOTE_TMP}
  mkdir -p /root/deploy-backups
  cp ${NGINX_CONF} /root/deploy-backups/nginx.conf.${STAMP}
  cp ${REMOTE_TMP} ${NGINX_CONF}
  nginx -t
  systemctl reload nginx
  echo 'nginx reloaded; previous config: /root/deploy-backups/nginx.conf.${STAMP}'"

echo "==> done"
