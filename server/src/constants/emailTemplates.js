const registerEmailTemplate = (url) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>File Management System</title>
        <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f7f7f7;
            margin: 0;
            padding: 0;
            text-align: center;
        }

        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        h1 {
            color: #333;
        }

        p {
            color: #666;
            line-height: 1.6;
        }

        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: white !important;
            text-decoration: none;
            border-radius: 10px;
            margin-top: 12px;
        }

        .button:hover {
            background-color: #0056b3;
        }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Welcome to File Management System</h1>
            <p>Hi there,</p>
            <p>We're excited to have you on board!</p>
            <p>You've successfully signed up to our File Management System. Now you can easily manage your files</p>
            <p>If you have any questions or need assistance, feel free to contact us.</p>
            <p>Click the button below to verify your email address:</p>
            <a href="${url}" style="color: #fff" class="button">Verify Email</a>
        </div>
    </body>
    </html>
  `;
};

export { registerEmailTemplate };
