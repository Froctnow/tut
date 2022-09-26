#!/bin/bash

echo "Sleeping 20 seconds while DB starting..."
sleep 20

echo "Running DB migrations..."
npx ts-node --transpile-only ./node_modules/typeorm/cli.js migration:run

npm run start:$1
