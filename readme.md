Talk Write Application with User Authentication and Interactive Cards

This is a real-time chat application built using Express.js, Socket.io, and MongoDB. The application features user authentication, interactive cards, and stores chat messages in a MongoDB database.

Features

- User authentication using Passport.js and bcrypt for password hashing
- Persistent storage of chat messages in MongoDB
- Real-time communication between users with Socket.io
- Interactive cards with options to play, delete, and add cards
- Deleting messages by users

Installation

1. Clone the repository
2. Install dependencies by running `npm install`
3. Update `connectionString` in `app.js` with your MongoDB connection string
4. Start the server by running `npm start`
5. Access the application at `http://localhost:3000`

Usage

- Visit the `/login` route to access the login page
- If you don't have an account, create one by signing up
- Once logged in, you will be redirected to the chat application

 Chatting

- Users can send messages and delete voice notes in real-time

Interactive Cards

- In the chat window, users can interact with cards by clicking on the card buttons
- To play a card, click the "Play" button on the card
- To delete a card, click the "Delete" button on the card
- To add a new card, enter text in the input box and click the "Send" button

Technologies Used

- Express.js
- Socket.io
- MongoDB (Mongoose)
- Passport.js
- bcrypt
- HTML, CSS, JavaScript

Please note that the chat application is intended for educational purposes and may require further optimization for production use.

please login with the credentials as below:
username:Prudvi
password:Prudvi123
