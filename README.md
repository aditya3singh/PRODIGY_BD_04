# PRODIGY_BD_04 - Redis Caching Implementation

## Overview
Task 03: Implement caching using Redis to optimize API performance. This project demonstrates the integration of Redis caching in a Node.js application with user management functionality.

## Features
- Redis caching for optimized data retrieval
- User management system with CRUD operations
- Real-time performance monitoring
- Cache invalidation strategies
- Response time tracking dashboard

## Tech Stack
- Node.js & Express.js
- MongoDB (Database)
- Redis (Caching)
- EJS (View Engine)
- Bootstrap 5 (UI)

## Prerequisites
Node.js: Ensure you have Node.js installed. You can download it from nodejs.org.
Redis: Make sure Redis is installed and running on your system. For installation guidance, refer to the Redis installation documentation.

## Installation
Clone the Repository:
bash
git clone https://github.com/yourusername/redis-prodigy.git
cd redis-prodigy

2. Install Dependencies:

bash
npm install

3. Configure Environment Variables:
Create a .env file in the root directory and add your MongoDB URI:

MONGODB_URI=your_mongodb_connection_string

4. Start the Server:

bash
npm start

5. Access the Application:

Open your browser and navigate to:
http://localhost:3000

## Usage
1. User Management

- View all users
- Add new users
- Update user details
- Delete users

2. Performance Monitoring

- Real-time cache hit rate
- Response time tracking
- Cache usage statistics

3. Error Handling

- Custom error pages
- 404 error handling

## Performance Improvements

- Cached user list (5 min expiration)
- Cached user details (10 min expiration)
- Automatic cache invalidation on CRUD operations
- Real-time cache hit rate monitoring

## Cache Statistics

![Cache Statistics](./images/cache-stats.png)

## Performance Dashboard

![Performance Dashboard](./images/performance-dashboard.png)    

## Error Handling

![Error Handling](./images/error-handling.png)

## User Management

![User Management](./images/user-management.png)   

## Contributing
Contributions are welcome! Feel free to fork the repository, make enhancements, and submit pull requests.

## License
This project is licensed under the MIT License.

