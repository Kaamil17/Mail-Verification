# BEIJE-TASK

# CHATGPT Chats for the assistance (https://chatgpt.com/c/d782cfa0-af08-4e88-82da-14fa0456ec21)

This project is a NestJS application that demonstrates user registration, email verification, and verification status checking functionalities using MongoDB and Nodemailer.

## **Table of Contents**

-Installation
-Configuration
-Usage
-Endpoints
-Testing
-Technologies Used

## **Installation**

Follow these steps to install and run the project:

### Install the NestJS CLI globally:

npm install -g @nestjs/cli

### Install project dependencies:

npm install

### Set up MongoDB:

Ensure you have a MongoDB instance running. You can use a local MongoDB instance or a cloud-based MongoDB service like MongoDB Atlas. In this project in the Config file add your MongoDb SRV connection string.

## # **Usage**

## # **IMPORTANT -- config folder**

please update the env-keys in the config folder with your database(Mongodb srv connection string ) and gmail email-password (App password) credenatials.

### Start the application:

npm run start:dev

**The application will be running on http://localhost:3000**

## # **Endpoints**

## User Registration

POST /user/register
Creates a random alphanumeric verification token.
Saves the user details { username, email, verificationToken, isVerified } in the MongoDB database.
Sends the verification token to the user's email address.

## Email Verification

GET /user/verify-email/:username/:verificationToken

Retrieves the URL parameters username and verificationToken.
Checks if the user exists in the database.
Verifies the token and sets isVerified to true if the token matches.
Returns a success response.

## Check Verification Status

GET /user/check-verification/:username

Retrieves the username from the URL parameters.
Checks if the user exists in the database.
Returns the verification status of the user.

## Services

### UserService

create(createUserDto: CreateUserDto): Generates a verification token, creates a user, and sends a verification email.
verifyEmail(username: string, verificationToken: string): Verifies the user's email by checking the token and updating the isVerified status.
checkVerification(username: string): Returns the verification status of the user.

## Controllers

### UserController

register(createUserDto: CreateUserDto): Handles user registration.
verifyEmail(username: string, verificationToken: string): Handles email verification.
checkVerification(username: string): Checks the verification status of the user.

# # **Testing**

## Installation for Testing

Install the required testing utilities:

npm install --save-dev @nestjs/testing jest @types/jest ts-jest

## Running Tests

Run the tests using the following command:

npm run test

### \*\*# Test Structure

### \*\*# UserService Tests:

Tests for creating a user, verifying email, and checking verification status.

### \*\*# UserController Tests:

Tests for user registration, email verification, and checking verification status.

# # **Technologies Used**

**NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications.

**MongoDB**: A NoSQL database for storing user information.

**Mongoose**: An ODM (Object Data Modeling) library for MongoDB and Node.js.

**Nodemailer**: A module for sending emails from Node.js applications.

**Jest**: A delightful JavaScript testing framework with a focus on simplicity.

**ID Generation**
\*\*Verification Token: A random alphanumeric string generated using the crypto module.
"# Beije-Task"  git init git add README.md
