#!/usr/bin/env bash
#
# Deploy public/ to the production VPS (nginx) with a server-side backup and
# post-deploy version verification.
#
#   npm run deploy            # full deploy
#   npm run deploy -- --dry-run
#
# Overridable via env: REMOTE (ssh host alias), WEBROOT, BACKUP_DIR.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REMOTE="${REMOTE:-jwip}"
WEBROOT="${WEBROOT:-/var/www/html}"
BACKUP_DIR="${BACKUP_DIR:-/root/deploy-backups}"
PARENT_DIR="$(dirname "$WEBROOT")"
WEB_DIR="$(basename "$WEBROOT")"

DRY_RUN=0
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=1 ;;
    -h|--help)
      sed -n '2,10p' "$0"
      exit 0
      ;;
    *)
      echo "unknown argument: $arg" >&2
      exit 2
      ;;
  esac
done

cd "$ROOT"

echo "==> release checks"
node scripts/verify-site.mjs

if [ -n "$(git status --porcelain 2>/dev/null || true)" ]; then
  echo "!! working tree is dirty — fine for a hotfix, but commit before a release"
fi

RSYNC=(rsync -az --delete --itemize-changes --exclude 'index.nginx-debian.html' --exclude '.DS_Store')

if [ "$DRY_RUN" -eq 1 ]; then
  echo "==> dry run: public/ -> ${REMOTE}:${WEBROOT}/"
  "${RSYNC[@]}" --dry-run public/ "${REMOTE}:${WEBROOT}/"
  exit 0
fi

STAMP="$(date +%Y%m%d-%H%M%S)"

echo "==> backup ${REMOTE}:${WEBROOT} -> ${BACKUP_DIR}/mysite-html-${STAMP}.tgz"
ssh "$REMOTE" "mkdir -p ${BACKUP_DIR} && tar czf ${BACKUP_DIR}/mysite-html-${STAMP}.tgz -C ${PARENT_DIR} ${WEB_DIR}"

echo "==> rsync public/ -> ${REMOTE}:${WEBROOT}/"
"${RSYNC[@]}" public/ "${REMOTE}:${WEBROOT}/"

echo "==> verify deployed versions"
REMOTE_VERSIONS="$(ssh "$REMOTE" "grep -o 'styles.css?v=[0-9]*' ${WEBROOT}/about.html | head -1; grep -o 'app.js?v=[0-9]*' ${WEBROOT}/about.html | head -1; grep -o 'mysite-v[0-9]*' ${WEBROOT}/sw.js | head -1")"
echo "${REMOTE_VERSIONS}"

LOCAL_STYLES="$(grep -o 'styles.css?v=[0-9]*' public/about.html | head -1)"
if ! printf '%s\n' "${REMOTE_VERSIONS}" | grep -q "${LOCAL_STYLES}"; then
  echo "!! deployed styles version does not match local (${LOCAL_STYLES})" >&2
  exit 1
fi

echo "==> done"
echo "rollback: ssh ${REMOTE} 'tar xzf ${BACKUP_DIR}/mysite-html-${STAMP}.tgz -C ${PARENT_DIR}'"
