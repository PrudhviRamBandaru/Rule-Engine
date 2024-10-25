# Rule-Based Evaluation API

This project provides a server-side API that supports creating, storing, and evaluating complex rule-based conditions. The rules can be saved in a MongoDB database and evaluated dynamically for given user data.

## Features

- **Rule Parsing**: Supports multiple conditions with logical operators (`&`, `|`) and comparison operators (`<`, `>`, `=`).
- **MongoDB Storage**: Saves the rule as both a human-readable string and an Abstract Syntax Tree (AST) representation in MongoDB.
- **Rule Evaluation**: Evaluates rules against user-provided data, making it suitable for dynamic data-driven decisions.

## Requirements

- [Node.js](https://nodejs.org/en/) (v12+)
- [MongoDB](https://www.mongodb.com/) (running locally or remotely)

## Setup

### Start mongodb

on Linux

```bash
sudo systemctl start mongodb.service
```

### Server Setup

1. **Navigate to the server directory:**
```bash
cd server
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create an .env file**
Copy the .env.example to .env

4. **Start the server:**
```bash
npm start
```

### Client Setup

1. **Navigate to the client directory:**
```bash
cd client
```

2. **Install dependencies:**
```bash
npm install
```
3. **Start the client:**
```bash
npm start
```
