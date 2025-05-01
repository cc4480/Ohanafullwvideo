#!/bin/bash

# Script to deploy database schema in production
echo "Running custom database push script..."
npx tsx scripts/db-push.ts
echo "Database push completed."
