export const VERIFICATION_EMAIL = (code) => {
    return `
    <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f5f5f5;
                }
                .container {
                    width: 50%;
                    margin: 0 auto;
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .heading {
                    font-size: 24px;
                    font-weight: bold;
                    color: #333;
                    margin-bottom: 20px;
                }
                .code {
                    font-size: 42px;
                    font-weight: bold;
                    color: #337ab7;
                    margin-bottom: 20px;
                }
                .footer {
                    font-size: 14px;
                    color: #666;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1 class="heading">Email Verification</h1>
                <p class="code">${code}</p>
                <p class="footer">This is an automatically generated email, please do not reply. If you have any questions or concerns, please contact our support team.</p>
            </div>
        </body>
    </html>
    `;
}

export const WELCOME_EMAIL = (name) => {
    return `
    <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f5f5f5;
                }
                .container {
                    width: 60%;
                    margin: 0 auto;
                    background-color: #ffffff;
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
                }
                .header {
                    font-size: 28px;
                    font-weight: bold;
                    color: #333;
                    margin-bottom: 30px;
                }
                .content {
                    font-size: 18px;
                    color: #555;
                    line-height: 1.6;
                    margin-bottom: 30px;
                }
                .footer {
                    font-size: 14px;
                    color: #777;
                    margin-top: 30px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1 class="header">Welcome to FaceMila, ${name}!</h1>
                <p class="content">We're thrilled to have you on board. FaceMila is your gateway to the world of facial recognition technology. Our platform, DeepFace, allows you to match faces with precision and ease. Explore the exciting features we offer and see how we can help you connect and engage like never before.</p>
                <p class="footer">This is an automatically generated email, please do not reply. If you have any questions, feel free to contact our support team.</p>
            </div>
        </body>
    </html>
    `;
}

export const RESET_PASSWORD_EMAIL = (link) => {
    return `
    <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f5f5f5;
                }
                .container {
                    width: 60%;
                    margin: 0 auto;
                    background-color: #3498db;
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
                }
                .header {
                    font-size: 28px;
                    font-weight: bold;
                    color: #fff;
                    margin-bottom: 30px;
                }
                .content {
                    font-size: 18px;
                    color: #fff;
                    line-height: 1.6;
                    margin-bottom: 30px;
                }
                .footer {
                    font-size: 14px;
                    color: #fff;
                    margin-top: 30px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1 class="header">Reset Password,!</h1>
                <p class="content">We've received a request to reset your password. If you didn't make the request, please disregard this email. Otherwise, click the link below to reset your password.</p>
                <a href="${link}" style="display: inline-block; background-color: #fff; color: #3498db; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Reset Password</a>
                <p class="footer">This is an automatically generated email, please do not reply. If you have any questions, feel free to contact our support team.</p>
            </div>
        </body>
    </html>
    `;
}

export const RESET_PASSWORD_SUCCESSFULLY_EMAIL = (name) => {
    return `
    <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #3498db;
                }
                .container {
                    width: 60%;
                    margin: 0 auto;
                    background-color: #fff;
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
                }
                .header {
                    font-size: 28px;
                    font-weight: bold;
                    color: #3498db;
                    margin-bottom: 30px;
                }
                .content {
                    font-size: 18px;
                    color: #333;
                    line-height: 1.6;
                    margin-bottom: 30px;
                }
                .footer {
                    font-size: 14px;
                    color: #666;
                    margin-top: 30px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1 class="header">Password Reset Successfully, ${name}!</h1>
                <p class="content">Your password has been reset successfully. You can now log in to your account using your new password. If you have any questions or need any help, feel free to contact our support team.</p>
                <p class="footer">This is an automatically generated email, please do not reply. If you have any questions, feel free to contact our support team.</p>
            </div>
        </body>
    </html>
    `;
}