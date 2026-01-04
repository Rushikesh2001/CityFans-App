const { google } = require("googleapis");

const oAuth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI
);

oAuth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

async function sendEmail(to, subject, body) {
    var message = '';
    try {
        const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
    
        const email = [
            `From: ${process.env.GMAIL_USER}`,
            `To: ${to}`,
            "Content-Type: text/html; charset=utf-8",
            "MIME-Version: 1.0",
            `Subject: ${subject}`,
            "",
            body,
        ].join("\n");
    
        const encodedMessage = Buffer.from(email)
            .toString("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");
    
        await gmail.users.messages.send({
            userId: "me",
            requestBody: {
            raw: encodedMessage,
            },
        });

        message = "Email sent successfully";
    } catch (error) {
        message = error.message;
    }

    return message;
}

module.exports = sendEmail;
