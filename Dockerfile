# Use the official PostgreSQL image from the Docker Hub
FROM postgres:latest

# Copy the backup file into the Docker image
COPY db_backup.sql /docker-entrypoint-initdb.d/
