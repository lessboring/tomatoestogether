#!/bin/bash

psql -h localhost -U postgres -c "DROP DATABASE IF EXISTS tomatoestogether"
psql -h localhost -U postgres -c "DROP DATABASE IF EXISTS test_tomatoestogether"
psql -h localhost -U postgres -c "DROP ROLE IF EXISTS tomatoestogether"

#read -s -p "Enter password for the newly-created 'tomatoestogether' PostgreSQL user: " password
#echo ""

psql -h localhost -U postgres -c "CREATE ROLE tomatoestogether WITH LOGIN ENCRYPTED PASSWORD '$password'"
psql -h localhost -U postgres -c "ALTER USER tomatoestogether CREATEDB"
psql -h localhost -U postgres -c "CREATE DATABASE test_tomatoestogether WITH OWNER tomatoestogether"
psql -h localhost -U postgres -c "CREATE DATABASE tomatoestogether WITH OWNER tomatoestogether"

# ./manage.py migrate
