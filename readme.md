<h1>API Server Readme</h1>
This is an  API server built using the MERN (MongoDB, Express, React, Node.js) stack. The server manages contacts and users, utilizes JWT for authentication, Gravatar for avatar generation, Multer for file uploads, Jimp to crop uploaded avatars, and Nodemailer for email verification.

<h2>Routes</h2>
The API server exposes the following routes:

- Creates a new user account.
- **POST /api/users/login:** Logs in an existing user.
- **GET /api/users/logout:** Logs out the currently authenticated user.
- **GET /api/users/current:** Retrieves the details of the currently authenticated user.
- **PATCH /api/users/avatars:** Updates the avatar of the currently authenticated user.
- **GET /api/users/verify/:verificationToken:** Verifies the user's email address using the provided verification token.
- **POST /api/users/verify:** Resends the verification email to the user.
- **GET /api/contacts:** Retrieves all contacts.
- **GET /api/contacts/favorite:** Retrieves the favorite contacts.
- **GET /api/contacts/:id:** Retrieves a specific contact by ID.
- **POST /api/contacts:** Adds a new contact.
- **DELETE /api/contacts/:id:** Deletes a specific contact by ID.
- **PUT /api/contacts/:id:** Updates a specific contact by ID.
- **PATCH /api/contacts/:id/favorite:** Toggles the favorite status of a specific contact by ID.

<h2>Environment Variables</h2>
The API server expects the following environment variables to be set:

- **PORT:** The port number on which the server will run (default: 3000).
- **BASE_URL:** The base URL of the server (default: http://localhost).
- **MONGO_URI:** The MongoDB connection URI.
- **JWT_SECRET:** The secret key used for JWT authentication.
- **SMTP_USER:** The email address used for sending verification emails.
- **SMTP_PASSWORD:** The password for the SMTP email account.

<h2>Installation and Setup</h2>
To run the API server locally, follow these steps:

- Clone the repository.
- Install the dependencies using npm install.
- Set the required environment variables in a .env file or through other means.
- Start the server using npm start.
- Make sure you have a running MongoDB instance and the necessary SMTP email account for email verification.

<h2>Middleware and Dependencies</h2>
The API server utilizes the following middleware and dependencies:

- express: Fast and minimalist web framework for Node.js.
- morgan: HTTP request logger middleware.
- cors: Cross-origin resource sharing middleware.
- multer: Middleware for handling file uploads.
- jimp: Image processing library for cropping avatars.
- nodemailer: Module for sending emails.
- jsonwebtoken: JSON Web Token implementation for authentication.
- Error Handling
- The server includes basic error handling. If a route is not found, it returns a JSON response with a 404 status code and the message "Not found." For other errors, it returns a JSON response with a 500 status code and the corresponding error message.

Feel free to modify and enhance the error handling based on your specific requirements.

Contact
If you have any questions or need further assistance, please contact us at pawel.rogowski.praca@gmail.com
