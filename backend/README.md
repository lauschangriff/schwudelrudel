# Schwudel Rudel Backend API

Express.js backend for managing vacation properties and voting.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Initialize the database with property data:
```bash
npm run init-db
```

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Properties

- `GET /api/properties` - Get all properties
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create new property
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property

### Voting

- `POST /api/vote` - Record a vote
  ```json
  {
    "propertyId": "property_id_here",
    "userId": "user123",
    "userName": "Alex",
    "vote": "yes"
  }
  ```

- `GET /api/votes/:propertyId` - Get votes for a property
- `GET /api/votes` - Get all votes

### Health Check

- `GET /health` - Server health status

## Environment Variables

See `.env` file:
- `MONGODB_URI` - MongoDB connection string
- `PORT` - Server port (default: 3000)
- `DATABASE_NAME` - Database name (default: schwudelrudel)
