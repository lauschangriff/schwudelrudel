# Schwudel Rudel 2026 - Vacation Property Planner

A full-stack application for managing and voting on vacation properties using MongoDB, Express.js, and vanilla JavaScript.

## 🚀 Quick Start

### 1. Start the Backend Server

#### Option A: Using Docker (Recommended)

```bash
# Build and start the backend
docker-compose up -d

# Initialize database (first time only)
docker-compose exec backend npm run init-db

# View logs
docker-compose logs -f backend
```

#### Option B: Using Node.js directly

```bash
cd backend
npm install
npm run init-db  # Initialize database with property data (first time only)
npm start        # Start the server on http://localhost:3000
```

### 2. Open the Frontend

Open `index-with-comments.html` in your browser. This version connects to the backend API.

**File Versions:**
- `index-with-comments.html` - Full-featured version with user selection, voting, and comments ⭐ **Recommended**
- `index-api.html` - Version with voting only
- `index.html` - Original static version (no backend needed)

## 📁 Project Structure

```
Schwudelrudel/
├── backend/
│   ├── server.js           # Express API server
│   ├── init-db.js          # Database initialization script
│   ├── package.json        # Backend dependencies
│   ├── .env                # MongoDB connection string
│   └── README.md           # Backend documentation
├── vacation_properties.json # Property data source
├── index.html              # Original static version (embedded data)
├── index-api.html          # API-connected version with voting
├── index-with-comments.html # Full version with comments ⭐
└── README.md               # This file
```

## 🎯 Features

### Backend API
- ✅ **MongoDB Integration** - All property data stored in MongoDB
- ✅ **RESTful API** - Full CRUD operations for properties
- ✅ **Voting System** - Record and retrieve votes for properties
- ✅ **Comment System** - Add and view comments on properties
- ✅ **CORS Enabled** - Frontend can connect from any origin

### Frontend
- ✅ **User Selection** - Modal on page load to select from 13 predefined users
- ✅ **Interactive Map** - Leaflet.js map showing property locations
- ✅ **Property Table** - Detailed information about each property
- ✅ **Pro/Contra Voting** - Vote Pro or Contra for each property
- ✅ **One Vote Per User** - Each user can only vote once per property (can change vote)
- ✅ **Smart Sorting** - Properties sorted by Pro votes (highest first)
- ✅ **Vote Counts** - Shows number of 👍 Pro and 👎 Contra votes per property
- ✅ **Active Vote Indicator** - Your current vote is highlighted with yellow border
- ✅ **Comment System** - Add and view comments for each property with timestamps
- ✅ **Delete Comments** - Users can delete their own comments
- ✅ **Real-time Data** - Fetches latest data from MongoDB
- ✅ **Unavailable Properties** - Greyed out properties marked as "not available"
- ✅ **Comment Counts** - Badge showing number of comments per property

## 🔧 API Endpoints

### Properties
- `GET /api/properties` - Get all properties
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create new property
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property

### Voting
- `POST /api/vote` - Record or update a vote (upsert - one vote per user per property)
  ```json
  {
    "propertyId": "property_id_here",
    "userId": "user_id",
    "userName": "Alex",
    "vote": "pro|contra"
  }
  ```
  **Note:** If user already voted, their vote will be updated instead of creating a duplicate.
- `GET /api/votes/:propertyId` - Get votes for a property
- `GET /api/votes` - Get all votes

### Comments
- `POST /api/comment` - Add a comment
  ```json
  {
    "propertyId": "property_id_here",
    "userId": "user_id",
    "userName": "Alex",
    "text": "This looks great!"
  }
  ```
- `GET /api/comments/:propertyId` - Get comments for a property
- `GET /api/comments` - Get all comments
- `DELETE /api/comment/:id` - Delete a comment

## 💾 Database

**MongoDB Connection:** The connection string is stored in `backend/.env`

**Collections:**
- `properties` - Vacation rental properties
- `votes` - User votes for properties
- `comments` - User comments on properties

## 🎨 How to Use

1. **Select Your Name** - Choose from the modal when page loads:
   - Jan, Heidi, Domi, Miri, Manu, Bella, Ralf, Andy, Anjali, Joel, Susanne, Sandra, or Alex
2. **Browse Properties** - View on map or in table (sorted by Pro votes)
3. **Vote** - Click 👍 Pro or 👎 Contra for each property
   - You can only vote once per property
   - Your current vote is highlighted with a yellow border
   - Click the other button to change your vote
4. **See Vote Counts** - View Pro/Contra breakdown for each property
5. **Comment** - Click 💬 Comments to add or view comments
6. **Delete Your Comments** - Click "Delete" button on your own comments
7. **View Details** - Click "View →" to see the original listing

## 🔄 Updating Data

To update property data:

1. Edit `vacation_properties.json`
2. Run `npm run init-db` in the backend folder
3. Refresh the browser

## 📝 Notes

- Backend must be running for `index-api.html` and `index-with-comments.html` to work
- Votes and comments are stored with timestamp for tracking
- Properties marked as "not available" cannot be voted on
- User selection is required before voting or commenting
- User names are limited to the predefined list of 13 team members
- Selected user is stored in localStorage for convenience
- Comments support multiline text and are sorted by newest first
- Users can only delete their own comments
- **Voting:**
  - Each user can vote only once per property (Pro or Contra)
  - Clicking the same vote button again will keep it (no toggle-off)
  - Clicking the opposite button will change your vote
  - Vote counts show: 👍 Pro votes, 👎 Contra votes, and total
  - Properties are sorted by Pro votes (highest first), then by total votes
  - Your current vote is highlighted with a yellow border
- Page auto-refreshes after voting to show updated counts and sorting

## 🛠️ Development

```bash
# Backend development with auto-reload
cd backend
npm run dev

# View all votes
curl http://localhost:3000/api/votes

# View all comments
curl http://localhost:3000/api/comments

# Check server health
curl http://localhost:3000/health
```

## 👥 Team Members

The application is configured for the following users:
- Jan
- Heidi
- Domi
- Miri
- Manu
- Bella
- Ralf
- Andy
- Anjali
- Joel
- Susanne
- Sandra
- Alex
