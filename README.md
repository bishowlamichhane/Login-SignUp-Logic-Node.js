User Authentication API
  This API allows users to register and log in securely using JWT and bcrypt for password authentication. It also supports access and refresh tokens for session management, and file uploads using Multer and   Cloudinary.


Features:
  JWT Authentication: Secure login and token-based authentication using access tokens and refresh tokens.
  Password Hashing: User passwords are hashed using bcrypt for secure storage.
  File Uploads: Handles user file uploads (e.g., profile pictures) using Multer and uploads files to Cloudinary.
  Access Token Refresh: Generates new access tokens using refresh tokens for continuous session management.

  
Technologies Used:
  Node.js and Express.js for server-side logic
  JWT for authentication
  bcrypt for password hashing
  Multer for handling file uploads
  Cloudinary for storing uploaded files

  
Endpoints:
  POST /register: Register a new user with hashed password.
  POST /login: Authenticate user and return access/refresh tokens.

  
Security:
Passwords are hashed using bcrypt before being stored.
JWT tokens are used to secure routes, and token expiry ensures limited access.
