#!/bin/bash
docker-compose down --volumes && docker-compose up --build -d
sleep 10