<div align="center">
  <img src="./readme-assets/project-logo.svg" alt="Logo" width="400">
  <h1></h1>
</div>

![Static Badge](https://img.shields.io/badge/NestJS-v11.0.1-red)
![Static Badge](https://img.shields.io/badge/npm-v11.6.2-green)
![Static Badge](https://img.shields.io/badge/node-v24.13.0-green)
![Static Badge](https://img.shields.io/badge/License-MIT-cyan)

## 📋 Table of Contents

- [📍 Overview](#overview)
- [✨ Features](#-features)
- [🛠️ Built With](#️-built-with)
- [📢 Important Notes](#-important-notes)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Installation](#installation)
  - [Development Server](#development-server)
  - [Production Server](#production-server)
- [🔌 API Endpoints](#-api-endpoints)
  - [Authentication](#authentication)
  - [Parking](#parking)
  - [Payments](#payments)
  - [Reservation](#reservation)
- [🤝 Credits](#-credits)
- [📄 License](#-license)
- [👨‍💻 Author](#-author)

## 📍 Overview

**ParkEasy** is a full-stack application, which gives user data about all parking spots in a parking lot in real time, giving them a peace of mind, when searching for free parking spots, while reducing time spent in that activity. Reservation functionality is also available for users, preventing sudden parking from other drivers to that spot.

This repository contains backend portion of the application, written in NestJS. Main goal of this project is demonstration of scalable, maintainable and reliable API applications using NestJS, while adhering to security standards.

This project was done as part of the **[GITA (Georgia's Innovation and Technology Agency)](https://gita.gov.ge/en)** course, where I was tasked to create prototype of the innovative product.

## ✨ Features

- **Modular Architecture** - Structured using NestJS modules for scalable and maintainable backend development.
- **RESTful API Design** - Clean and well-structured endpoints for managing parking spaces, reservations, and users.
- **Authentication System** - Secure user authentication implemented with encrypted passwords and cookie-based sessions.
- **Data Validation** - Request validation using DTOs with class-validator to ensure reliable and consistent API inputs.
- **Database Integration** - Persistent data storage using TypeORM with SQLite for simple and efficient database management.
- **Reservation Management** - Full backend logic for creating, tracking, and managing parking space reservations.
- **Real-time Sensor Updates** - Server-Sent Events (SSE) support for streaming parking spot status updates from sensors.

## 🛠️ Built With

- **NestJS** - Backend framework providing robust module based architecture.
- **TypeORM** - Popular object relational mapper for easy database integration.
- **SQLite** - Simple file based SQL database.
- **Bcrypt** - Encryption library used for password encryption.
- **cookie-session** - Library for implementing cookie based authentication.
- **class-validator** - Library used for validating request DTOs.
- **class-transformer** - Library used for transforming and serializing objects.

## 📢 Important Notes

Please note, that ESP32 prototype was used for this project, which physically detects 1:42 sized toy cars using HC-SR04 sensors and lights corresponding 5mm RGB LED lamp with corresponding colour.

Detailed information about prototype building will be provided **soon.**

## 🚀 Getting Started

### Prerequisites

- Node.js (`v24.13.0` or later)
- npm (`v11.6.2` or later)
- NestJS (`v11.0.1` or later)

### Environment Variables

These environment variables must be set up in `.env`, which is crucial for the application functionality

_Note: This file must be present in project's root directory._

- `SESSION_SECRET` - Specifies secret key for session cookie encoding.
- `ENCRYPTION_ALGORITHM` - Specifies encryption algorithm for payment card data encoding.
- `ENCRYPTION_KEY` - Specifies encryption key for payment card data encoding.
- `ACTIVE_RESERVATION_RATE_PER_MINUTE` - Specifies rate of the reserved parking spot per minute.

### Installation

```bash
# Clone current repository
git clone https://github.com/Chantuu/ParkEasy_Angular.git
```

```bash
# Install required dependencies
npm install
```

### Development Server

```bash
# Start the development server in watch mode
npm run start:dev
```

### Production Server

```bash
# Start the production server
npm run start:prod
```

`http://localhost:{$Your_Port}/api` will be used as a base URL to send requests to the endpoints.

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user.
- `POST /api/auth/login` - Sign in existing user.
- `GET /api/auth/logout` - Log out currently signed in user.
- `GET /api/auth/currentUser` - Get currently signed in user.
- `DELETE /api/auth/delete` - Delete currently signed in user.

### Parking

- `SSE /api/parking/parkingSpots` - SSE endpoint returning current parking spots.
- `POST /api/parking/sensor` - Save currenty parking data from the sensor.

### Payments

- `GET /api/payments/paymentCard` - Get currently saved payment card.
- `POST /api/payments/paymentCard` - Register new payment card for the current user.
- `DELETE /api/payments/paymentCard` - Delete existing payment for the current user.
- `POST /api/payments/pay` - Perform payment for the current reservation.

### Reservation

- `SSE /api/reservation` - SSE endpoint returning currently active reservation.
- `GET /api/reservation/calculatePrice` - Calculate total price for ending currently active reservation.
- `GET /api/reservation/inactive` - Return history of old reservations.
- `POST /api/reservation` - Create new reservation.
- `PATCH /api/reservation` - Edit current reservation to change it's status.

## 🤝 Credits

This project makes use of the following open-source tools and resources:

- **[NestJS](https://nestjs.com)** – Backend framework used for application creation.
- **[TypeORM](https://typeorm.io)** – Open-source Relational object mapper for easy database integration.
- **[SQLite](https://sqlite.org)** – Open-source and easy SQL database.
- **[Shields.io](https://shields.io/)** – Badges used in the README for versioning and project status.

Special thanks to **[GITA (Georgia's Innovation and Technology Agency)](https://gita.gov.ge/en)** for providing required hardware and help to make this project possible.

## 📄 License

This project is licensed under the **MIT License** - See the [LICENSE](https://github.com/Chantuu/Angular_Weather_Forecast?tab=MIT-1-ov-file) file for details.

## 👨‍💻 Author

Thank you for exploring this project! Check out my other work on [GitHub](https://github.com/Chantuu).
