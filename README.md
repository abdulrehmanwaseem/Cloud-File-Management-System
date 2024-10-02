# File Management System

![Project Image](https://res.cloudinary.com/dgljsrfmk/image/upload/v1727893011/lzqyovecydza15rxymdr.png)

**Note:** This project was developed approximately two months ago but is being pushed to GitHub now.

A comprehensive file management system built using the MERN stack (MongoDB, Express, React, Node.js).

## Technologies Used

- **Frontend:** React, Redux
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Job Queue:** BullMQ
- **Caching:** Redis
- **File Storage:** Cloudinary
- **Email:** Nodemailer
- **Authentication:** JSON Web Tokens (JWT)

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- Secure user authentication and authorization
- File upload, download, and management
- Integration with Cloudinary for file storage
- Redis-based caching for improved performance
- Email notifications using Nodemailer
- RESTful API with full CRUD operations

## Installation

To set up the project locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/abdulrehman-code/File-Management-System.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd /client and /server
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Set up environment variables:**

   - Create a `.env` file in the root directory and populate it with the required variables as shown below.

5. **Run the application:**

   ```bash
   npm run dev
   ```

## Usage

- Visit `http://localhost:3000` to access the application.
- Register or log in to start managing your files.
- Use the dashboard to upload, download, and manage files.

## Environment Variables

Create a `.env` file in the root directory of /server and include the following variables:

```plaintext
PORT=your_port_value
NODE_ENV=your_node_env_value
CLIENT_URL=your_client_url_value
MONGO_URI=your_mongo_uri_value
JWT_SECRET=your_jwt_secret_value
JWT_EXPIRES_IN=your_jwt_expires_in_value
COOKIE_EXPIRES_IN=your_cookie_expires_in_value
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name_value
CLOUDINARY_API_KEY=your_cloudinary_api_key_value
CLOUDINARY_API_SECRET=your_cloudinary_api_secret_value
REDIS_PORT=your_redis_port_value
REDIS_HOST=your_redis_host_value
REDIS_PASSWORD=your_redis_password_value
SMTP_HOST=your_smtp_host_value
SMTP_PORT=your_smtp_port_value
SMTP_USER=your_smtp_user_value
SMTP_PASS=your_smtp_pass_value
FROM_EMAIL=your_from_email_value
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

## License

This project is licensed under the MIT License.

## Contact

For any questions or issues, feel free to contact [Abdul Rehman](mailto:abdulrehman.code1@gmail.com).
