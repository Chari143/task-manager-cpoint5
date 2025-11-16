#!/bin/sh
set -e
npx prisma generate
npx prisma db push
echo "Starting server..."
node dist/index.js