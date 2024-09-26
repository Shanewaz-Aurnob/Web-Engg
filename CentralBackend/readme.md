# ERP-API-Web-Engineering

## Overview

This repository contains the source code for the ERP (Enterprise Resource Planning) API built with NodeJs using the ExpressJs framework. The application provides a robust backend for managing various aspects of enterprise resources.

## Prerequisites

Before getting started, ensure that you have NodeJs installed on your machine. You can download it from [Node.js website](https://nodejs.org/).

## Installation

To resolve project dependencies, run the following command in the terminal within the project directory:

```
npm i
```

## Usage

### Development Mode

To run the application in development mode, use the following command:

```
npm run dev
```

The server will listen on port 5000 by default, and you can access it at [http://localhost:5000/](http://localhost:5000/).

## Project Structure

- **middleware**: This folder contains middleware modules that are called in between a server response. Each file may contain similar middleware based on their working principles.

- **routes**: The routes folder maintains modularity and cleanliness of the code. It contains route modules for different functionalities.

- **server.js**: This file serves as the anchoring point of the application, housing the main functionality of the ERP API.

## Contributing

Feel free to contribute to the project by opening issues or creating pull requests. Your input is highly appreciated!

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For any inquiries or feedback, please contact [mmxNiloy](https://github.com/mmxNiloy).

Happy coding!
