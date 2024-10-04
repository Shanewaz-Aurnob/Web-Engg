# Smart Attendance System for CU (University of Chittagong)

## Introduction
This project is a smart attendance system developed for the Department of Computer Science and Engineering (CSE) at the University of Chittagong. It was part of a large-scale project involving multiple teams, and our focus was specifically on creating the attendance system.

## Features
- **Session Creation**: Teachers can create attendance sessions for courses they are assigned to. Each session includes a countdown timer and a secret 8-character code.
- **Student Attendance**: Students enrolled in the course will see the countdown, an input field, and a submit button. Upon scanning a QR code, they will receive the secret code and can submit their attendance.
- **Network Verification**: Attendance can only be submitted if the student is physically present and connected to the IT building's network via SSID.
- **Automatic Data Handling**: When a teacher creates a session, the enrolled students' information is inserted into the attendance data table with a default status of 'absent'. This status updates to 'present' only after the student inputs the correct secret code and submits it.

## Technologies Used
- **Frontend**: React, Tailwind CSS
- **Backend**: SQL Workbench, Express.js, Keysley, MySQL, TypeScript
- **Common Components**: We have a common component folder named `wels-component` used by all teams to maintain UI design integrity.

## Project Structure
The project is divided into three levels:

### Level 0: Individual Project Teams
Each team worked on their individual projects.

### Level 1: Core Functional Teams
1. **GUI**: Interface design and implementation.
2. **Database**: Database management and integration.
3. **Server Build and Deploy**: Backend development and deployment.

Each part had at least one team from every Level-0 team.

### Level 2: Coordination Team
One team member from every Level-0 team was part of this team to provide updates on GUI, database, and build and deploy progress.

## Team Members
- **Khadiza Jarin Roza**: GUI
- **Ratri Barua**: GUI
- **Raisa Nuzhat**: GUI
- **Nazifa Mim**: Build and Deploy
- **Shanewaz Aurnob**: Database

## Deployment
- **GitHub Repository**: [GitHub Link](https://github.com/ShanewazAurnob/Web-Engg)
- **Deployed Application**: [Deployment Link](http://bike-csecu.com:3040/)

## Installation and Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/ShanewazAurnob/Web-Engg
   cd repo
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the database:
   ```bash
   cd ./CentralBackend
   npm run dev
   ```
4. Run the server:
   ```bash
   npm run dev
   ```
5. Open the application in your browser at `http://localhost:3000`.

## Usage
1. **Teacher**: Log in and create a session. The system will generate a countdown timer and an 8-character secret code.
2. **Student**: Log in, scan the QR code to receive the secret code, enter it into the input field, and submit your attendance.

## Contributing
We welcome contributions! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines on how to get started.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Acknowledgements
We would like to thank our department for the support and guidance throughout this project.
