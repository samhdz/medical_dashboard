#!/bin/bash

echo "Starting backend server..."
cd backend
source venv/bin/activate
uvicorn main:app --reload
