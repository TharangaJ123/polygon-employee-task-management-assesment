# Polygon Employee Task Management

## Project Overview
This project is an Employee Task Management application built for the Polygon assessment. The application consists of two main components:
* **Backend (`/server`)**: A Node.js REST API built with Express, TypeScript, and MySQL. It handles user authentication via JWT and manages employee tasks.
* **Frontend (`/client`)**: A mobile application built with React Native and Expo. It provides a user-friendly interface for employees and admins to manage their tasks.

---

## Installation Steps

### Prerequisites
Before running the application, make sure you have the following installed:
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [MySQL Server](https://dev.mysql.com/downloads/installer/) (v8.0 or higher)
* [Expo Go app](https://expo.dev/client) installed on your physical mobile device (Android/iOS)

### 1. Clone the repository
Extract the provided project ZIP file or clone the Git repository to your local machine.

### 2. Install Server Dependencies
Navigate to the `server` directory and install the packages:
```bash
cd server
npm install
```

### 3. Install Client Dependencies
Navigate to the `client` directory and install the packages:
```bash
cd ../client
npm install --legacy-peer-deps
```

---

## Environment Configuration

### Backend Configuration
The backend relies on environment variables. A default `.env` file is already included in the `server` directory, but you must ensure your local MySQL credentials match.

Check the `server/.env` file and update `DB_PASSWORD` and `DB_USER` if necessary:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=db_password_is_here
DB_NAME=employee_tasks_db
JWT_SECRET=jwt_token_is_here
```

### Frontend Configuration
The frontend connects to the backend locally. Make sure the API base URL in the frontend matches the IP address of your machine running the server.

---

## Database Setup Instructions

The backend provides a convenient automated script to create the database, tables, and seed test users.

1. Ensure your local **MySQL server is running**.
2. Open a terminal in the `server` directory.
3. Run the database initialization script:
   ```bash
   npx tsx scripts/initDb.ts
   ```
4. **Success!** The script will automatically create the `employee_tasks_db` database, the `users` and `tasks` tables, and insert test accounts.

**Test Accounts Provided:**
* **Admin:** Email: `admin@test.com` | Password: `admin123`
* **Employee:** Email: `employee@test.com` | Password: `employee123`

---

## Build Instructions (Running the App)

### Quick Start (Demo Mode)
For convenience, you can run the `start-demo.bat` file located at the root of the project. It will automatically check dependencies and start both the backend and frontend simultaneously. 

### Manual Startup

**1. Start the Backend Server**
```bash
cd server
npm run dev
```
The server will start running on `http://localhost:5000`.

**2. Start the Frontend Expo App**
Open a **new terminal** and run:
```bash
cd client
npm start
```
This will open the Expo Metro Bundler in your browser or terminal. 
* Scan the generated QR code using the **Expo Go** app on your phone.
* Make sure your phone and your computer are connected to the **same Wi-Fi network**.

### Building the APK for Android
If you wish to build a standalone APK via EAS (Expo Application Services), use the following commands inside the `client` directory:
```bash
npm install -g eas-cli
eas build --platform android --profile preview
```
*(Note: A local backend cannot be accessed by a production APK unless the backend is deployed and hosted on the internet).*
