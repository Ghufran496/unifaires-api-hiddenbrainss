const ElasticEmail = require("@elasticemail/elasticemail-client");
const client = ElasticEmail.ApiClient.instance;
const apikey = client.authentications["apikey"];
apikey.apiKey = process.env.ELASTIC_EMAIL_API_KEY;

const emailsApi = new ElasticEmail.EmailsApi();

// set send grid config

class EmailServices {
  // email activation
  async elasticEmailConfirmation(data) {
    // Generate 6 digit

    const { email, token } = data;

    const emailData = {
      Recipients: [
        {
          Email: email,
          Fields: {
            name: process.env.APP_NAME,
          },
        },
      ],
      Content: {
        Body: [
          {
            ContentType: "HTML",
            Charset: "utf-8",
            Content: `Your verification code is ${token}`,
          },
        ],
        From: process.env.APP_EMAIL,
        Subject: "Unifaires Account Activation",
      },
    };

    const callback = (error, data, response) => {
      if (error) {
        return false;
      } else {
        return true;
      }
    };

    emailsApi.emailsPost(emailData, callback);
  }

  async sendToken(data) {
    // Generate 6 digit
    let status;
    const { email, token } = data;

    const emailData = {
      Recipients: [
        {
          Email: email,
          Fields: {
            name: process.env.APP_NAME,
          },
        },
      ],
      Content: {
        Body: [
          {
            ContentType: "HTML",
            Charset: "utf-8",
            Content: `Your verification code is ${token}`,
          },
        ],
        From: process.env.APP_EMAIL,
        Subject: "Unifaires Account Activation",
      },
    };

    function sendMail() {
      return new Promise((resolve, reject) => {
        emailsApi.emailsPost(emailData, (error, data, response) => {
          if (error) {
            resolve(false);
          } else {
            resolve(true);
          }
        });
      });
    }

    return await sendMail();
  }

  async mailVoucher(data) {
    const { email, token } = data;

    // Make sure to provide a valid "FROM" email address in process.env.APP_EMAIL
    const fromEmail = process.env.APP_EMAIL; // Update with your sender email

    const emailData = {
      Recipients: [
        {
          Email: email,
          Fields: {
            name: process.env.APP_NAME,
          },
        },
      ],
      Content: {
        Body: [
          {
            ContentType: "HTML",
            Charset: "utf-8",
            Content: `Your verification code is ${token}`,
          },
        ],
        From: fromEmail, // Set the "FROM" email address
        Subject: "Unifaires Account Activation",
      },
    };

    const callback = (error, data, response) => {
      if (error) {
        console.error("Error sending email:", error);
        if (response && response.body) {
          console.error("API response:", response.body);
        }
        return false;
      } else {
        return true;
      }
    };

    emailsApi.emailsPost(emailData, callback);
  }
}

module.exports = new EmailServices();
