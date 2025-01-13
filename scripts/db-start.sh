#!/bin/bash
docker-compose down --volumes && docker-compose up -d
sleep 10