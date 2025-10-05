# Docker Deployment Guide

## Quick Start with Docker

### Option 1: Using Docker Compose (Recommended)

From the root directory (Schwudelrudel):

```bash
# Build and start the backend
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop the backend
docker-compose down
```

### Option 2: Using Docker directly

```bash
# Build the image
cd backend
docker build -t schwudelrudel-backend .

# Run the container
docker run -d \
  -p 3000:3000 \
  -e MONGODB_URI="mongodb://root:8zoObOSvuToWFiUPcH1plbVDyuFgUCUT34pu8wB5aS9yp6sn2jmyFa9zEWEXCI6m@116.203.131.84:5433/?directConnection=true" \
  -e DATABASE_NAME=schwudelrudel \
  --name schwudelrudel-backend \
  schwudelrudel-backend

# View logs
docker logs -f schwudelrudel-backend

# Stop and remove
docker stop schwudelrudel-backend
docker rm schwudelrudel-backend
```

## Initialize Database

After starting the container:

```bash
# Using docker-compose
docker-compose exec backend npm run init-db

# Using docker directly
docker exec schwudelrudel-backend npm run init-db
```

## Environment Variables

The following environment variables can be configured:

- `MONGODB_URI` - MongoDB connection string (required)
- `PORT` - Server port (default: 3000)
- `DATABASE_NAME` - Database name (default: schwudelrudel)

## Development with Docker

For development with auto-reload:

```bash
# Using docker-compose with volume mount
docker-compose -f docker-compose.dev.yml up
```

Create `docker-compose.dev.yml`:

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=${MONGODB_URI}
      - PORT=3000
      - DATABASE_NAME=schwudelrudel
    volumes:
      - ./backend:/app
      - /app/node_modules
    command: npm run dev
    networks:
      - schwudelrudel-network

networks:
  schwudelrudel-network:
    driver: bridge
```

## Health Check

```bash
curl http://localhost:3000/health
```

## Production Deployment

For production, consider:

1. **Use environment variables file:**
   ```bash
   # Create .env file
   echo "MONGODB_URI=your_connection_string" > .env

   # Use with docker-compose
   docker-compose --env-file .env up -d
   ```

2. **Multi-stage build for smaller image:**
   Update Dockerfile for production optimization

3. **Use secrets management:**
   Don't commit MongoDB credentials to version control

## Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs backend

# Or
docker logs schwudelrudel-backend
```

### Can't connect to MongoDB
- Ensure MongoDB host is accessible from Docker container
- Check if firewall allows connections
- Verify MongoDB credentials

### Port already in use
```bash
# Change port in docker-compose.yml
ports:
  - "3001:3000"  # Use 3001 on host instead
```
