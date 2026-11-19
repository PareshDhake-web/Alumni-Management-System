
# Alumni Management System

A web-based Alumni Management System designed to connect students, alumni, and teachers through a centralized platform. It helps manage alumni profiles, educational information, professional details, student records, and shared memories through an organized web application.

## 📌 Project Overview

The Alumni Management System provides a common platform where students and teachers can access and manage academic and alumni-related information.

Students can register, create profiles, update their personal and educational details, explore alumni information, view batch-wise records, and share memories through a gallery.

Teachers can register, manage student records, search for students, and view their profiles.

The main objective is to simplify alumni information management and improve communication between students and teachers.

## ✨ Key Features

### 👨‍🎓 Student Module
- Student registration and login.
- Create and manage personal profiles.
- Update personal and educational information.
- Add qualification, passing year, skills, and contact details.
- Add professional information, including company, job title, and experience.
- View teacher information.
- Explore students batch-wise based on passing year.
- View individual student profiles.
- Edit and delete student profiles.
- Access the gallery and share memories.

### 👨‍🏫 Teacher Module
- Teacher registration and login.
- Teacher profile management.
- View registered student records.
- Search students by username.
- Add new student records.
- View individual student details.
- Edit and delete student information.

### 🖼️ Gallery Module
- Add images with location and date.
- Include descriptions with uploaded image links.
- Display shared memories in a centralized gallery.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Webpage structure |
| CSS3 | Styling and layout |
| JavaScript | Application functionality |
| Node.js | Backend runtime environment |
| Express.js | Backend framework and routing |
| MongoDB | Database |
| Mongoose | Database connectivity and schema management |
| EJS | Dynamic webpage rendering |
| EJS-Mate | EJS layout management |
| Bootstrap / CSS | Interface styling |
| Git & GitHub | Version control and project hosting |

## ⚙️ Project Architecture

The project follows a server-side MVC-inspired structure.

- **Models:** Manage database schemas and data.
- **Views:** Display dynamic webpages using EJS templates.
- **Application:** Handles server configuration, routes, and application logic.
- **Public:** Contains static resources such as CSS, JavaScript, and images.

## 📂 Project Structure

```text
Alumni-Management-System/
│
├── models/
│   ├── User.js
│   ├── Student.js
│   └── Gallery.js
│
├── public/
│   └── Static files (CSS, JS, Images)
│
├── views/
│   ├── student/
│   └── teacher/
│
├── app.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## 🚀 Installation and Setup

Follow these steps to run the project on your local machine.

### 1. Clone the Repository

```bash
git clone https://github.com/PareshDhake-web/Alumni-Management-System.git
```

### 2. Navigate to the Project Folder

```bash
cd Alumni-Management-System
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start MongoDB

Make sure MongoDB is installed and running locally.

The current application connects to:

```text
mongodb://127.0.0.1:27017/alumni
```

### 5. Run the Application

```bash
npm start
```

Alternatively, if Nodemon is installed:

```bash
npm run server
```

### 6. Open in Browser

```text
http://localhost:8080
```

The application will be available on your local server.

## 🔄 Application Workflow

1. Open the application.
2. Select the Student or Teacher section.
3. Register a new account.
4. Log in using the registered credentials.
5. Access the respective dashboard.
6. Manage profiles and student information.
7. Explore batch-wise student records.
8. View and share memories through the gallery.

## 🎯 Project Objectives

- Develop a centralized alumni information management platform.
- Maintain organized student and alumni records.
- Provide separate student and teacher interfaces.
- Simplify profile and academic information management.
- Enable batch-wise student information access.
- Encourage connections through shared memories and information.

## 🔮 Future Enhancements

- Implement secure password hashing and authentication.
- Add email verification and password recovery.
- Introduce an advanced alumni search and filtering system.
- Add job opportunities and placement management.
- Implement alumni networking and communication.
- Add an administrator dashboard.
- Deploy the application on a cloud platform.

## 🔐 Security Note

This project is an academic implementation. Before production deployment, authentication and authorization should be strengthened, passwords must be securely hashed, hardcoded credentials must be removed, and sensitive configuration should be stored in environment variables.

## 👨‍💻 Developer

**Paresh Khushal Dhake**

MCA Student | Full Stack Developer

- GitHub: [PareshDhake-web](https://github.com/PareshDhake-web)
- Project Repository: [Alumni Management System](https://github.com/PareshDhake-web/Alumni-Management-System)

---

⭐ If you find this project useful, consider giving it a star!

**Thank you for visiting my project!**

