#!/bin/bash

# Run drizzle-kit push to update the database schema
echo "Running drizzle-kit push to update database schema..."
npx drizzle-kit push:pg
echo "Database schema updated successfully!"