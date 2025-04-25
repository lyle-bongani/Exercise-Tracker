# Exercise Tracker API

A full-stack JavaScript application that allows users to track their exercises. This project is based on the freeCodeCamp Exercise Tracker challenge.

## Features

- Create new users
- Add exercises for users with descriptions, durations, and dates
- Retrieve user exercise logs
- Filter logs by date range and limit the number of results
- Full API and web interface

## API Endpoints

- `POST /api/users` - Create a new user
  - Body: `{ username: String }`
  - Response: `{ username: String, _id: String }`

- `GET /api/users` - Get a list of all users
  - Response: `[{ username: String, _id: String }, ...]`

- `POST /api/users/:_id/exercises` - Add an exercise for a user
  - Body: `{ description: String, duration: Number, date: String (optional) }`
  - Response: `{ username: String, description: String, duration: Number, date: String, _id: String }`

- `GET /api/users/:_id/logs` - Get a user's exercise log
  - Query Parameters: 
    - `from` - Date (yyyy-mm-dd)
    - `to` - Date (yyyy-mm-dd)
    - `limit` - Number
  - Response: `{ username: String, count: Number, _id: String, log: [{ description: String, duration: Number, date: String }, ...] }`

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/exercise-tracker
   ```

4. Make sure MongoDB is running on your system.

5. Start the application:
   ```
   npm start
   ```

6. For development with auto-restart:
   ```
   npm run dev
   ```

7. Open the application in your browser:
   ```
   http://localhost:3000
   ```

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- HTML/CSS
- JavaScript (ES6+)

## Example Usage

### Create a new user
```
POST /api/users
Body: { username: "johndoe" }
```

### Add an exercise
```
POST /api/users/5fb5853f734231456ccb3b05/exercises
Body: { 
  description: "Morning Run", 
  duration: 30,
  date: "2023-01-15"
}
```

### Get user logs
```
GET /api/users/5fb5853f734231456ccb3b05/logs?from=2023-01-01&to=2023-01-31&limit=5
``` 