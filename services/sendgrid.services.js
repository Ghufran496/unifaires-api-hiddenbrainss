const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// set send grid config

class SendGridServices {
  // email activation
  async welcomeSignup(data) {}

  async forgetPassword(data) {
    // Generate 6 digit

    const { email, token, firstname } = data;

    const msg = {
      to: email,
      from: "support@tryunifaires.com",
      subject: "Reset Password - Unifaires",

      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
  </head>
  <div
    style="
      display: none;
      overflow: hidden;
      line-height: 1px;
      opacity: 0;
      max-height: 0;
      max-width: 0;
    "
  >
    Password Reset Request
  </div>
  <body
    style="background-color:#f9f9f9;color:#333;font-family:&#x27;Arial&#x27;, sans-serif"
  >
    <table
      align="center"
      width="100%"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="
        max-width: 37.5em;
        padding: 20px;
        margin: 0 auto;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      "
    >
      <tbody>
        <tr style="width: 100%">
          <td>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="background-color: #fff"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      align="center"
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="
                        background-color: #eee;
                        display: flex;
                        padding: 20px 0;
                        align-items: center;
                        justify-content: center;
                      "
                    >
                      <tbody>
                        <tr>
                          <td>
                            <img
                              alt="Unifaires&#x27;s Logo"
                              height="45"
                              src="https://res.cloudinary.com/ds5zvytw3/image/upload/v1720351099/unifaires-logo.png"
                              style="
                                display: block;
                                outline: none;
                                border: none;
                                text-decoration: none;
                              "
                              width="150"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table
                      align="center"
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="padding: 25px 35px"
                    >
                      <tbody>
                        <tr>
                          <td>
                            <h1
                              style="color:#333;font-family:&#x27;Arial&#x27;, sans-serif;font-size:20px;font-weight:bold;margin-bottom:15px"
                            >
                              Password Reset Request
                            </h1>
                            <p
                              style="font-size:14px;line-height:24px;margin:20px 0;color:#333;font-family:&#x27;Arial&#x27;, sans-serif;margin-bottom:20px"
                            >
                              Hi
                              <span style="text-transform: capitalize"
                                >${firstname}</span
                              >

                              <!-- -->,
                            </p>
                            <p
                              style="font-size:14px;line-height:24px;margin:20px 0;color:#333;font-family:&#x27;Arial&#x27;, sans-serif;margin-bottom:20px"
                            >
                              We received a request to reset your password for
                              your Unifaires account. If you did not request a
                              password reset, please ignore this email.
                            </p>
                            <p
                              style="font-size:14px;line-height:24px;margin:20px 0;color:#333;font-family:&#x27;Arial&#x27;, sans-serif;margin-bottom:20px"
                            >
                              Your password reset token is:
                            </p>
                            <table
                              align="center"
                              width="100%"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              role="presentation"
                              style="
                                background: rgb(245, 244, 245);
                                border-radius: 4px;
                                margin-bottom: 30px;
                                padding: 40px 10px;
                              "
                            >
                              <tbody>
                                <tr>
                                  <td>
                                    <p
                                      style="
                                        font-size: 30px;
                                        line-height: 24px;
                                        margin: 16px 0;
                                        text-align: center;
                                        vertical-align: middle;
                                      "
                                    >
                                      ${token}
                                    </p>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <p
                              style="font-size:14px;line-height:24px;margin:20px 0;color:#333;font-family:&#x27;Arial&#x27;, sans-serif;margin-bottom:20px"
                            >
                              Please use this token to reset your password. If
                              you have any issues, feel free to contact our
                              support team.
                            </p>
                            <p
                              style="font-size:14px;line-height:24px;margin:20px 0;color:#333;font-family:&#x27;Arial&#x27;, sans-serif;margin-bottom:20px"
                            >
                              Best regards,
                            </p>
                            <p
                              style="font-size:14px;line-height:24px;margin:20px 0;color:#333;font-family:&#x27;Arial&#x27;, sans-serif;margin-bottom:20px"
                            >
                              The Unifaires Team
                            </p>
                            <hr
                              style="
                                width: 100%;
                                border: none;
                                border-top: 1px solid #eaeaea;
                              "
                            />
                            <p
                              style="font-size:14px;line-height:24px;margin:20px 0;color:#333;font-family:&#x27;Arial&#x27;, sans-serif;margin-bottom:20px"
                            >
                              Stay up to date with our latest news and features.
                            </p>
                            <hr
                              style="
                                width: 100%;
                                border: none;
                                border-top: 1px solid #eaeaea;
                              "
                            />
                            <p
                              style="font-size:12px;line-height:24px;margin:20px 0;color:#333;font-family:&#x27;Arial&#x27;, sans-serif;padding:0 20px;text-align:center"
                            >
                              Copyright © 2025-2026 Unifaires GmbH. All Rights
                              Reserved<br /><a
                                href="https://unifaires.com/terms"
                                style="color:#5e6ad2;text-decoration:underline;font-family:&#x27;Arial&#x27;, sans-serif;font-size:14px"
                                target="_blank"
                                >Terms of Service</a
                              >
                              <!-- -->|<!-- -->
                              <a
                                href="https://unifaires.com/privacy"
                                style="color:#5e6ad2;text-decoration:underline;font-family:&#x27;Arial&#x27;, sans-serif;font-size:14px"
                                target="_blank"
                                >Privacy Policy</a
                              >
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
`,
tracking_settings: {
  click_tracking: { enable: false, enable_text: false }, // Disable tracking
},

    };
    return sgMail
      .send(msg)
      .then(() => {
        return {
          status: 200,
          message: "token sent successfully",
        };
      })
      .catch((error) => {
        return {
          status: 400,
          error,
          message: "something went wrong ",
        };
      });
  }

  async businessToken(data) {
    const { email, token, firstname } = data;

    const msg = {
      to: email,
      from: "support@tryunifaires.com",
      subject: "Password reset code",
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
  </head>
  <div
    style="
      display: none;
      overflow: hidden;
      line-height: 1px;
      opacity: 0;
      max-height: 0;
      max-width: 0;
    "
  >
    Your Token for Unifaires
    <div></div>
  </div>
  <body
    style="
      background-color: #f9f9f9;
      color: #333;
      font-family: Arial, sans-serif;
    "
  >
    <table
      align="center"
      width="100%"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="
        max-width: 48.5em;
        padding: 20px;
        margin: 0 auto;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      "
    >
      <tbody>
        <tr style="width: 100%">
          <td>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="background-color: #fff"
            >
              <tbody>
                <tr>
                  <img
                    alt="Unifaires Logo"
                    height="45"
                    src="https://dev-api.tryunifaires.com/images/Unifaires%20New%20Logo_024703.png"
                    style="
                      display: block;
                      outline: none;
                      border: none;
                      text-decoration: none;
                    "
                    width="150"
                  />
                </tr>
                <tr>
                  <td>
                    <table
                      align="center"
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="padding: 25px 35px"
                    >
                      <tbody>
                        <tr>
                          <td>
                            <h1
                              style="
                                margin: 0 6em;
                                color: #333;
                                font-family: Arial, sans-serif;
                                font-size: 20px;
                                font-weight: bold;
                                margin-bottom: 15px;
                                text-align: center;
                              "
                            >
                              Forgot your password? It happens to the best of
                              us.
                            </h1>
                            <p
                              style="
                                font-size: 18px;
                                line-height: 24px;
                                margin: 20px 0;
                                color: #333;
                                font-family: Arial, sans-serif;
                                margin-bottom: 20px;
                                text-align: center;
                              "
                            >
                              Please use the following verification code to
                              reset your password.
                            </p>
                            <table
                              align="center"
                              width="100%"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              role="presentation"
                              style="
                                background: rgb(245, 244, 245);
                                border-radius: 4px;
                                margin-bottom: 30px;
                                padding: 20px 10px;
                                width: 15rem;
                              "
                            >
                              <tbody>
                                <tr>
                                  <td>
                                    <p
                                      style="
                                        font-size: 30px;
                                        line-height: 24px;
                                        margin: 16px 0;
                                        text-align: center;
                                        vertical-align: middle;
                                      "
                                    >
                                      ${token}
                                    </p>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <p
                              style="
                                font-size: 16px;
                                line-height: 24px;
                                margin: 20px 3em;
                                color: #333;
                                font-family: Arial, sans-serif;
                              "
                            >
                              If you do not want to change your password or
                              didn&#x27;t request a reset, you can ignore and
                              delete this email.
                            </p>
                            <hr
                              style="
                                width: 100%;
                                border: none;
                                border-top: 1px solid #eaeaea;
                              "
                            />
                            <p
                              style="
                                font-size: 14px;
                                line-height: 24px;
                                margin: 20px 3em;
                                color: #333;
                                font-family: Arial, sans-serif;
                              "
                            >
                              Unifaires is a comprehensive media and internet
                              content platform empowering users, organizations,
                              and educators to share, access, and monetize
                              diverse content across education, career, health,
                              news, and community-focused categories.
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td style="text-align: center">
                            <a
                              href="https://unifaires.com/"
                              style="
                                color: #333;
                                text-decoration: none;
                                font-family: Arial, sans-serif;
                                font-size: 14px;
                                background: rgb(245, 244, 245);
                                border-radius: 4px;
                                margin-bottom: 30px;
                                padding: 20px 10px;
                                width: 5rem;
                                font-weight: bold;
                              "
                              target="_blank"
                              >www.tryunifaires.com</a
                            >
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
`,
tracking_settings: {
  click_tracking: { enable: false, enable_text: false }, // Disable tracking
},
};
    return sgMail
      .send(msg)
      .then(() => {
        return {
          status: 200,
          message: "token sent successfully",
        };
      })
      .catch((error) => {
        return {
          status: 400,
          error,
          message: "something went wrong ",
        };
      });
  }

  async userToken(data) {
    // Generate 6 digit

    const { email, token, firstname } = data;

    const msg = {
      to: email,
      from: "support@tryunifaires.com",
      subject: "Password reset code",

      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
  </head>
  <div
    style="
      display: none;
      overflow: hidden;
      line-height: 1px;
      opacity: 0;
      max-height: 0;
      max-width: 0;
    "
  >
    Your Token for Unifaires
    <div></div>
  </div>
  <body
    style="
      background-color: #f9f9f9;
      color: #333;
      font-family: Arial, sans-serif;
    "
  >
    <table
      align="center"
      width="100%"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="
        max-width: 48.5em;
        padding: 20px;
        margin: 0 auto;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      "
    >
      <tbody>
        <tr style="width: 100%">
          <td>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="background-color: #fff"
            >
              <tbody>
                <tr>
                  <img
                    alt="Unifaires Logo"
                    height="45"
                    src="https://dev-api.tryunifaires.com/images/Unifaires%20New%20Logo_024703.png"
                    style="
                      display: block;
                      outline: none;
                      border: none;
                      text-decoration: none;
                    "
                    width="150"
                  />
                </tr>
                <tr>
                  <td>
                    <table
                      align="center"
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="padding: 25px 35px"
                    >
                      <tbody>
                        <tr>
                          <td>
                            <h1
                              style="
                                margin: 0 6em;
                                color: #333;
                                font-family: Arial, sans-serif;
                                font-size: 20px;
                                font-weight: bold;
                                margin-bottom: 15px;
                                text-align: center;
                              "
                            >
                              Forgot your password? It happens to the best of
                              us.
                            </h1>
                            <p
                              style="
                                font-size: 18px;
                                line-height: 24px;
                                margin: 20px 0;
                                color: #333;
                                font-family: Arial, sans-serif;
                                margin-bottom: 20px;
                                text-align: center;
                              "
                            >
                              Please use the following verification code to
                              reset your password.
                            </p>
                            <table
                              align="center"
                              width="100%"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              role="presentation"
                              style="
                                background: rgb(245, 244, 245);
                                border-radius: 4px;
                                margin-bottom: 30px;
                                padding: 20px 10px;
                                width: 15rem;
                              "
                            >
                              <tbody>
                                <tr>
                                  <td>
                                    <p
                                      style="
                                        font-size: 30px;
                                        line-height: 24px;
                                        margin: 16px 0;
                                        text-align: center;
                                        vertical-align: middle;
                                      "
                                    >
                                      ${token}
                                    </p>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <p
                              style="
                                font-size: 16px;
                                line-height: 24px;
                                margin: 20px 3em;
                                color: #333;
                                font-family: Arial, sans-serif;
                              "
                            >
                              If you do not want to change your password or
                              didn&#x27;t request a reset, you can ignore and
                              delete this email.
                            </p>
                            <hr
                              style="
                                width: 100%;
                                border: none;
                                border-top: 1px solid #eaeaea;
                              "
                            />
                            <p
                              style="
                                font-size: 14px;
                                line-height: 24px;
                                margin: 20px 3em;
                                color: #333;
                                font-family: Arial, sans-serif;
                              "
                            >
                              Unifaires is a comprehensive media and internet
                              content platform empowering users, organizations,
                              and educators to share, access, and monetize
                              diverse content across education, career, health,
                              news, and community-focused categories.
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td style="text-align: center">
                            <a
                              href="https://unifaires.com/"
                              style="
                                color: #333;
                                text-decoration: none;
                                font-family: Arial, sans-serif;
                                font-size: 14px;
                                background: rgb(245, 244, 245);
                                border-radius: 4px;
                                margin-bottom: 30px;
                                padding: 20px 10px;
                                width: 5rem;
                                font-weight: bold;
                              "
                              target="_blank"
                              >www.tryunifaires.com</a
                            >
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
`,
tracking_settings: {
  click_tracking: { enable: false, enable_text: false }, // Disable tracking
},

    };
    return sgMail
      .send(msg)
      .then(() => {
        return {
          status: 200,
          message: "token sent successfully",
        };
      })
      .catch((error) => {
        return {
          status: 400,
          error,
          message: "something went wrong ",
        };
      });
  }

  async voucher({ email, voucher }) {
    // Generate 6 digit

    const msg = {
      to: email,
      from: "support@tryunifaires.com",
      subject: " Associate Account - Unifaires",

      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
  </head>
  <div
    style="
      display: none;
      overflow: hidden;
      line-height: 1px;
      opacity: 0;
      max-height: 0;
      max-width: 0;
    "
  >
    User Invite Confirmation
    <div>
     </div>
  </div>
  <body
    style="background-color:#f9f9f9;color:#333;font-family:&#x27;Arial&#x27;, sans-serif"
  >
    <table
      align="center"
      width="100%"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="
        max-width: 37.5em;
        padding: 20px;
        margin: 0 auto;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      "
    >
      <tbody>
        <tr style="width: 100%">
          <td>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="background-color: #fff"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      align="center"
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="
                        background-color: #eee;
                        display: flex;
                        padding: 20px 0;
                        align-items: center;
                        justify-content: center;
                      "
                    >
                      <tbody>
                        <tr>
                          <td>
                            <img
                              alt="Unifaires&#x27;s Logo"
                              height="45"
                              src="https://res.cloudinary.com/ds5zvytw3/image/upload/v1720351099/unifaires-logo.png"
                              style="
                                display: block;
                                outline: none;
                                border: none;
                                text-decoration: none;
                              "
                              width="150"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table
                      align="center"
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="padding: 25px 35px"
                    >
                      <tbody>
                        <tr>
                          <td>
                            <h1
                              style="color:#333;font-family:&#x27;Arial&#x27;, sans-serif;font-size:20px;font-weight:bold;margin-bottom:15px"
                            >
                              User Invite Confirmation
                            </h1>
                            <p
                              style="font-size:14px;line-height:24px;margin:20px 0;color:#333;font-family:&#x27;Arial&#x27;, sans-serif;margin-bottom:20px"
                            >
                              Hi
                              <!-- -->,
                            </p>
                            <p
                              style="font-size:14px;line-height:24px;margin:20px 0;color:#333;font-family:&#x27;Arial&#x27;, sans-serif;margin-bottom:20px"
                            >
                              Great news! Your acceptance of the invitation to
                              join the Unifaires community has been confirmed.
                              You&#x27;re now officially a part of our network.
                            </p>
                            <p
                              style="font-size:14px;line-height:24px;margin:20px 0;color:#333;font-family:&#x27;Arial&#x27;, sans-serif;margin-bottom:20px"
                            >
                              Below is your Access Code:
                            </p>
                            <table
                              align="center"
                              width="100%"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              role="presentation"
                              style="
                                background: rgb(245, 244, 245);
                                border-radius: 4px;
                                margin-bottom: 30px;
                                padding: 40px 10px;
                              "
                            >
                              <tbody>
                                <tr>
                                  <td>
                                    <p
                                      style="
                                        font-size: 30px;
                                        line-height: 24px;
                                        margin: 16px 0;
                                        text-align: center;
                                        vertical-align: middle;
                                      "
                                    >
                                      ${voucher}
                                    </p>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <p
                              style="font-size:14px;line-height:24px;margin:20px 0;color:#333;font-family:&#x27;Arial&#x27;, sans-serif;margin-bottom:20px"
                            >
                              Next steps:
                            </p>
                            <p
                              style="font-size:14px;line-height:24px;margin:10px 0;color:#333;font-family:&#x27;Arial&#x27;, sans-serif;padding-left:20px"
                            >
                              • Explore: Start engaging with the community.
                            </p>
                            <p
                              style="font-size:14px;line-height:24px;margin:10px 0;color:#333;font-family:&#x27;Arial&#x27;, sans-serif;padding-left:20px"
                            >
                              • Customize: Personalize your profile.
                            </p>
                            <p
                              style="font-size:14px;line-height:24px;margin:20px 0;color:#333;font-family:&#x27;Arial&#x27;, sans-serif;margin-bottom:20px"
                            >
                              Thank you for joining us. We&#x27;re excited to
                              have you!
                            </p>
                            <p
                              style="font-size:14px;line-height:24px;margin:20px 0;color:#333;font-family:&#x27;Arial&#x27;, sans-serif;margin-bottom:20px"
                            >
                              Warm regards,
                            </p>
                            <p
                              style="font-size:14px;line-height:24px;margin:20px 0;color:#333;font-family:&#x27;Arial&#x27;, sans-serif;margin-bottom:20px"
                            >
                              Unifaires
                            </p>
                            <hr
                              style="
                                width: 100%;
                                border: none;
                                border-top: 1px solid #eaeaea;
                              "
                            />
                            <p
                              style="font-size:14px;line-height:24px;margin:20px 0;color:#333;font-family:&#x27;Arial&#x27;, sans-serif;margin-bottom:20px"
                            >
                              Stay up to date with our latest news and features
                            </p>
                            <hr
                              style="
                                width: 100%;
                                border: none;
                                border-top: 1px solid #eaeaea;
                              "
                            />
                            <p
                              style="font-size:12px;line-height:24px;margin:20px 0;color:#333;font-family:&#x27;Arial&#x27;, sans-serif;padding:0 20px;text-align:center"
                            >
                              Copyright © 2025-2026 Unifaires GmbH. All Rights
                              Reserved<br /><a
                                href="https://unifaires.com/terms"
                                style="color:#5e6ad2;text-decoration:underline;font-family:&#x27;Arial&#x27;, sans-serif;font-size:14px"
                                target="_blank"
                                >Terms of Service</a
                              >
                              <!-- -->|<!-- -->
                              <a
                                href="https://unifaires.com/privacy"
                                style="color:#5e6ad2;text-decoration:underline;font-family:&#x27;Arial&#x27;, sans-serif;font-size:14px"
                                target="_blank"
                                >Privacy Policy</a
                              >
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
`,
tracking_settings: {
  click_tracking: { enable: false, enable_text: false }, // Disable tracking
},
    };
    return sgMail
      .send(msg)
      .then(() => {
        return {
          status: 200,
          message: "token sent successfully",
        };
      })
      .catch((error) => {
        return {
          status: 400,
          error,
          message: "something went wrong ",
        };
      });
  }

  async accountVerification(data) {
    // Generate 6 digit

    const { email, verificationLink, firstname } = data;

    const msg = {
      to: email,
      from: "support@tryunifaires.com",
      subject: "Unifaires Email Verification",

      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
  </head>
  <div
    style="
      display: none;
      overflow: hidden;
      line-height: 1px;
      opacity: 0;
      max-height: 0;
      max-width: 0;
    "
  >
    Welcome to Unifaires! Verify Your Email
    <div>
     </div>
  </div>
  <body
    style="background-color:#f9f9f9;color:#333;font-family:&#x27;Arial&#x27;, sans-serif"
  >
    <table
      align="center"
      width="100%"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="
        max-width: 37.5em;
        padding: 20px;
        margin: 0 auto;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      "
    >
      <tbody>
        <tr style="width: 100%">
          <td>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="background-color: #fff"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      align="center"
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="
                        background-color: #eee;
                        display: flex;
                        padding: 20px 0;
                        align-items: center;
                        justify-content: center;
                      "
                    >
                      <tbody>
                        <tr>
                          <td>
                            <img
                              alt="Unifaires&#x27;s Logo"
                              height="45"
                              src="https://res.cloudinary.com/ds5zvytw3/image/upload/v1720351099/unifaires-logo.png"
                              style="
                                display: block;
                                outline: none;
                                border: none;
                                text-decoration: none;
                              "
                              width="150"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table
                      align="center"
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="padding: 25px 35px"
                    >
                      <tbody>
                        <tr>
                          <td>
                            <h1
                              style="color:#333;font-family:&#x27;Arial&#x27;, sans-serif;font-size:24px;font-weight:bold;margin-bottom:15px;text-align:center"
                            >
                              Welcome to Unifaires!
                            </h1>
                            <p
                              style="font-size:14px;line-height:24px;margin:20px 0;color:#333;font-family:&#x27;Arial&#x27;, sans-serif;margin-bottom:20px;text-align:center"
                            >
                              Hello and thank you for joining Unifaires!
                              We&#x27;re excited to have you on board. Unifaires
                              is all about creating connections, driving
                              innovation, and fostering growth. We&#x27;re
                              thrilled to have you as part of our community and
                              can&#x27;t wait to start this journey together.
                            </p>
                            <table
                              align="center"
                              width="100%"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              role="presentation"
                              style="
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                flex-direction: column;
                              "
                            >
                              <tbody>
                                <tr>
                                  <td>
                                    <p
                                      style="font-size:14px;line-height:24px;margin:0;color:#333;font-family:&#x27;Arial&#x27;, sans-serif;font-weight:bold;text-align:center"
                                    >
                                      To get started, please verify your email
                                      address by clicking the button below or
                                      copying the link:
                                    </p>
                                    <a
                                      href="${verificationLink}"
                                      style="
                                        line-height: 100%;
                                        text-decoration: none;
                                        display: block;
                                        max-width: 100%;
                                        background-color: #913be3;
                                        border-radius: 5px;
                                        font-weight: 600;
                                        color: #fff;
                                        font-size: 16px;
                                        text-align: center;
                                        padding: 12px 24px 12px 24px;
                                        margin-top: 10px;
                                      "
                                      target="_blank"
                                      ><span
                                        ><!--[if mso
                                          ]><i
                                            style="
                                              letter-spacing: 24px;
                                              mso-font-width: -100%;
                                              mso-text-raise: 18;
                                            "
                                            hidden
                                            >&nbsp;</i
                                          ><!
                                        [endif]--></span
                                      ><span
                                        style="
                                          max-width: 100%;
                                          display: inline-block;
                                          line-height: 120%;
                                          mso-padding-alt: 0px;
                                          mso-text-raise: 9px;
                                        "
                                        >Verify Email</span
                                      ><span
                                        ><!--[if mso
                                          ]><i
                                            style="
                                              letter-spacing: 24px;
                                              mso-font-width: -100%;
                                            "
                                            hidden
                                            >&nbsp;</i
                                          ><!
                                        [endif]--></span
                                      ></a
                                    >
                                    <p
                                      style="
                                        font-size: 14px;
                                        line-height: 24px;
                                        margin: 16px 0;
                                        text-align: center;
                                      "
                                    >
                                      <a
                                      href="${verificationLink}"                                        style="color:#5e6ad2;text-decoration:underline;font-family:&#x27;Arial&#x27;, sans-serif;font-size:14px"
                                        target="_blank"
                                        > ${verificationLink}</a
                                      >
                                    </p>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <hr
                      style="
                        width: 100%;
                        border: none;
                        border-top: 1px solid #eaeaea;
                      "
                    />
                    <table
                      align="center"
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="padding: 25px 35px"
                    >
                      <tbody>
                        <tr>
                          <td>
                            <p
                              style="font-size:14px;line-height:24px;margin:0px;color:#333;font-family:&#x27;Arial&#x27;, sans-serif;text-align:center"
                            >
                              Please remember: Unifaires will never ask for your
                              password, credit card, or banking details via
                              email.
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <p
              style="font-size:12px;line-height:24px;margin:20px 0;color:#333;font-family:&#x27;Arial&#x27;, sans-serif;padding:0 20px;text-align:center"
            >
              You&#x27;re receiving this email because you signed up for
              Unifaires. If you have any questions, feel free to reach out to us
              at<!-- -->
              <a
                href="mailto:support@tryunifaires.com"
                style="color:#5e6ad2;text-decoration:underline;font-family:&#x27;Arial&#x27;, sans-serif;font-size:14px"
                target="_blank"
                >support@tryunifaires.com</a
              >.<br />©
              <!-- -->2024<!-- -->
              Unifaires, Inc. All rights reserved.<br /><a
                href="https://unifaires.com"
                style="color:#5e6ad2;text-decoration:underline;font-family:&#x27;Arial&#x27;, sans-serif;font-size:14px"
                target="_blank"
                >Visit our website</a
              >
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
`,
      tracking_settings: {
        click_tracking: { enable: false, enable_text: false }, // Disable tracking
      },
    };
    return sgMail
      .send(msg)
      .then(() => {
        return {
          success: true,
          status: 200,
          message: "token sent successfully",
        };
      })
      .catch((error) => {
        return {
          success: false,
          status: 400,
          error,
          message: "something went wrong ",
        };
      });
  }

  async inviteUserMail(data) {
    // Generate 6 digit

    const { email, acceptLink, companyName } = data;

    const msg = {
      to: email,
      from: "support@tryunifaires.com",
      subject: "Invitation to Manage Account - Unifaires",

      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
  </head>
  <div
    style="
      display: none;
      overflow: hidden;
      line-height: 1px;
      opacity: 0;
      max-height: 0;
      max-width: 0;
    "
  >
    Manage Account Invite
    <div></div>
  </div>
  <body
    style="background-color:#f9f9f9;color:#333;font-family:&#x27;Arial&#x27;, sans-serif"
  >
    <table
      align="center"
      width="100%"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="
        max-width: 37.5em;
        padding: 20px;
        margin: 0 auto;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      "
    >
      <tbody>
        <tr style="width: 100%">
          <td>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="background-color: #fff"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      align="center"
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="
                        background-color: #eee;
                        display: flex;
                        padding: 20px 0;
                        align-items: center;
                        justify-content: center;
                      "
                    >
                      <tbody>
                        <tr>
                          <td>
                            <img
                              alt="Unifaires&#x27;s Logo"
                              height="45"
                              src="https://res.cloudinary.com/ds5zvytw3/image/upload/v1720351099/unifaires-logo.png"
                              style="
                                display: block;
                                outline: none;
                                border: none;
                                text-decoration: none;
                              "
                              width="150"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table
                      align="center"
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="padding: 25px 35px"
                    >
                      <tbody>
                        <tr>
                          <td>
                            <h1
                              style="color:#333;font-family:&#x27;Arial&#x27;, sans-serif;font-size:20px;font-weight:bold;margin-bottom:15px"
                            >
                              Manage Account Invite
                            </h1>
                            <p
                              style="font-size:14px;line-height:24px;margin:20px 0;color:#333;font-family:&#x27;Arial&#x27;, sans-serif;margin-bottom:20px"
                            >
                              Dear ${email},
                            </p>
                            <p
                              style="font-size:14px;line-height:24px;margin:20px 0;color:#333;font-family:&#x27;Arial&#x27;, sans-serif;margin-bottom:20px"
                            >
                              You have been invited by ${companyName}
                              to help manage their account on Unifaires. This is
                              a great opportunity to collaborate and access
                              shared features designed to facilitate efficient
                              management and oversight.
                            </p>
                            <p
                              style="font-size:14px;line-height:24px;margin:20px 0;color:#333;font-family:&#x27;Arial&#x27;, sans-serif;margin-bottom:20px"
                            >
                              Please follow these steps to accept the invitation
                              and get started:
                            </p>
                            <p
                              style="font-size:14px;line-height:24px;margin:10px 0;color:#333;font-family:&#x27;Arial&#x27;, sans-serif;padding-left:20px"
                            >
                              1. Accept the Invitation: Click the button below
                              to confirm your willingness to manage the account.
                            </p>
                            <a
                              href="${acceptLink}"
                              style="
                                line-height: 100%;
                                text-decoration: none;
                                display: block;
                                max-width: 100%;
                                background-color: #913be3;
                                border-radius: 5px;
                                font-weight: 600;
                                color: #fff;
                                font-size: 16px;
                                text-align: center;
                                padding: 12px 24px 12px 24px;
                                margin-top: 10px;
                              "
                              target="_blank"
                              ><span
                                ><!--[if mso
                                  ]><i
                                    style="
                                      letter-spacing: 24px;
                                      mso-font-width: -100%;
                                      mso-text-raise: 18;
                                    "
                                    hidden
                                    >&nbsp;</i
                                  ><!
                                [endif]--></span
                              ><span
                                style="
                                  max-width: 100%;
                                  display: inline-block;
                                  line-height: 120%;
                                  mso-padding-alt: 0px;
                                  mso-text-raise: 9px;
                                "
                                >Accept Invitation</span
                              ><span
                                ><!--[if mso
                                  ]><i
                                    style="
                                      letter-spacing: 24px;
                                      mso-font-width: -100%;
                                    "
                                    hidden
                                    >&nbsp;</i
                                  ><!
                                [endif]--></span
                              ></a
                            >

                            <p>
                              or Copy below link 
                            <a
                              href="${acceptLink}"
                              style="
                                                           "
                              target="_blank"
                              ><span
                                ><!--[if mso
                                  ]><i
                                    style="
                                      letter-spacing: 24px;
                                      mso-font-width: -100%;
                                      mso-text-raise: 18;
                                    "
                                    hidden
                                    >&nbsp;</i
                                  ><!
                                [endif]--></span
                              ><span
                                style="
                                  max-width: 100%;
                                  display: inline-block;
                                  line-height: 120%;
                                  mso-padding-alt: 0px;
                                  mso-text-raise: 9px;
                                "
                                >${acceptLink}</span
                              ><span
                                ><!--[if mso
                                  ]><i
                                    style="
                                      letter-spacing: 24px;
                                      mso-font-width: -100%;
                                    "
                                    hidden
                                    >&nbsp;</i
                                  ><!
                                [endif]--></span
                              ></a
                            >
                            </p>
                            <p
                              style="font-size:14px;line-height:24px;margin:10px 0;color:#333;font-family:&#x27;Arial&#x27;, sans-serif;padding-left:20px"
                            >
                              2. Set Up Your Access: Once you accept,
                              you&#x27;ll be prompted to log in or create a new
                              account if you don&#x27;t already have one.
                            </p>
                            <p
                              style="font-size:14px;line-height:24px;margin:20px 0;color:#333;font-family:&#x27;Arial&#x27;, sans-serif;margin-bottom:20px"
                            >
                              As an account manager, you will have the ability
                              to access and perform specific functions that are
                              crucial for the effective management of the
                              account. Please ensure that you understand the
                              responsibilities that come with these
                              capabilities.
                            </p>
                            <p
                              style="font-size:14px;line-height:24px;margin:20px 0;color:#333;font-family:&#x27;Arial&#x27;, sans-serif;margin-bottom:20px"
                            >
                              Should you have any questions or require further
                              information, please feel free to contact<!-- -->
                              <a
                                href="mailto:support@tryunifaires.com"
                                style="color:#5e6ad2;text-decoration:underline;font-family:&#x27;Arial&#x27;, sans-serif;font-size:14px"
                                target="_blank"
                                >support@tryunifaires.com</a
                              >
                              <!-- -->or visit our support center.
                            </p>
                            <p
                              style="font-size:14px;line-height:24px;margin:20px 0;color:#333;font-family:&#x27;Arial&#x27;, sans-serif;margin-bottom:20px"
                            >
                              We look forward to seeing the great work you will
                              achieve together!
                            </p>
                            <p
                              style="font-size:14px;line-height:24px;margin:20px 0;color:#333;font-family:&#x27;Arial&#x27;, sans-serif;margin-bottom:20px"
                            >
                              Warm regards,
                            </p>
                            <p
                              style="font-size:14px;line-height:24px;margin:20px 0;color:#333;font-family:&#x27;Arial&#x27;, sans-serif;margin-bottom:20px"
                            >
                              Unifaires
                            </p>
                            <hr
                              style="
                                width: 100%;
                                border: none;
                                border-top: 1px solid #eaeaea;
                              "
                            />
                            <p
                              style="font-size:14px;line-height:24px;margin:20px 0;color:#333;font-family:&#x27;Arial&#x27;, sans-serif;margin-bottom:20px"
                            >
                              Stay up to date with our latest news and features
                            </p>
                            <hr
                              style="
                                width: 100%;
                                border: none;
                                border-top: 1px solid #eaeaea;
                              "
                            />
                            <p
                              style="font-size:12px;line-height:24px;margin:20px 0;color:#333;font-family:&#x27;Arial&#x27;, sans-serif;padding:0 20px;text-align:center"
                            >
                              Copyright © 2025-2026 Unifaires GmbH. All Rights
                              Reserved<br /><a
                                href="https://unifaires.com/terms"
                                style="color:#5e6ad2;text-decoration:underline;font-family:&#x27;Arial&#x27;, sans-serif;font-size:14px"
                                target="_blank"
                                >Terms of Service</a
                              >
                              <!-- -->|<!-- -->
                              <a
                                href="https://unifaires.com/privacy"
                                style="color:#5e6ad2;text-decoration:underline;font-family:&#x27;Arial&#x27;, sans-serif;font-size:14px"
                                target="_blank"
                                >Privacy Policy</a
                              >
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
`,
      tracking_settings: {
        click_tracking: { enable: false, enable_text: false }, // Disable tracking
      },
    };
    return sgMail
      .send(msg)
      .then(() => {
        return {
          status: 200,
          message: "token sent successfully",
        };
      })
      .catch((error) => {
        return {
          status: 400,
          error,
          message: "something went wrong ",
        };
      });
  }

  async helpAndSupport({ email, supportLink }) {
    // Generate 6 digit

    const msg = {
      to: email,
      from: "support@tryunifaires.com",
      subject: "Help Support - Unifaires",

      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
  </head>
  <div
    style="
      display: none;
      overflow: hidden;
      line-height: 1px;
      opacity: 0;
      max-height: 0;
      max-width: 0;
    "
  >
    Support
    <div></div>
  </div>
  <body
    style="background-color:#f9f9f9;color:#333;font-family:&#x27;Arial&#x27;, sans-serif"
  >
    <table
      align="center"
      width="100%"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="
        max-width: 37.5em;
        padding: 20px;
        margin: 0 auto;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      "
    >
      <tbody>
        <tr style="width: 100%">
          <td>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="background-color: #fff"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      align="center"
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="
                        background-color: #eee;
                        display: flex;
                        padding: 20px 0;
                        align-items: center;
                        justify-content: center;
                      "
                    >
                      <tbody>
                        <tr>
                          <td>
                            <img
                              alt="Unifaires&#x27;s Logo"
                              height="45"
                              src="https://res.cloudinary.com/ds5zvytw3/image/upload/v1720351099/unifaires-logo.png"
                              style="
                                display: block;
                                outline: none;
                                border: none;
                                text-decoration: none;
                              "
                              width="150"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table
                      align="center"
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="padding: 25px 35px"
                    >
                      <tbody>
                        <tr>
                          <td>
                            <h1
                              style="color:#333;font-family:&#x27;Arial&#x27;, sans-serif;font-size:20px;font-weight:bold;margin-bottom:15px"
                            >
                              Help and Support
                            </h1>
                            <p
                              style="font-size:14px;line-height:24px;margin:20px 0;color:#333;font-family:&#x27;Arial&#x27;, sans-serif;margin-bottom:20px"
                            >
                              Hi there,
                            </p>
                            <p
                              style="font-size:14px;line-height:24px;margin:20px 0;color:#333;font-family:&#x27;Arial&#x27;, sans-serif;margin-bottom:20px"
                            >
                              Thank you for reaching out to Unifaires support.
                              We&#x27;re here to assist you with any questions
                              or issues you may have.
                            </p>
                            <p
                              style="font-size:14px;line-height:24px;margin:20px 0;color:#333;font-family:&#x27;Arial&#x27;, sans-serif;margin-bottom:20px"
                            >
                              Your support ticket has been created with ID:
                              <p
                                      style="
                                        font-size: 14px;
                                        line-height: 24px;
                                        margin: 16px 0;
                                        text-align: center;
                                      "
                                    >
                                      <a
                                      href="${supportLink}"                                        style="color:#5e6ad2;text-decoration:underline;font-family:&#x27;Arial&#x27;, sans-serif;font-size:14px"
                                        target="_blank"
                                        > ${supportLink}</a
                                      >
                                    </p>
                              <strong></strong>.
                            </p>
                            <p
                              style="font-size:14px;line-height:24px;margin:20px 0;color:#333;font-family:&#x27;Arial&#x27;, sans-serif;margin-bottom:20px"
                            >
                              To track the progress of your request or provide
                              additional information, please visit our support
                              portal:
                            </p>
                            <a
                            href="${supportLink}"
                            style="
                              line-height: 100%;
                              text-decoration: none;
                              display: block;
                              max-width: 100%;
                              background-color: #913be3;
                              border-radius: 5px;
                              font-weight: 600;
                              color: #fff;
                              font-size: 16px;
                              text-align: center;
                              padding: 12px 24px 12px 24px;
                              margin-top: 10px;
                            "
                            target="_blank"
                            ><span
                              ><!--[if mso
                                ]><i
                                  style="
                                    letter-spacing: 24px;
                                    mso-font-width: -100%;
                                    mso-text-raise: 18;
                                  "
                                  hidden
                                  >&nbsp;</i
                                ><!
                              [endif]--></span
                            ><span
                              style="
                                max-width: 100%;
                                display: inline-block;
                                line-height: 120%;
                                mso-padding-alt: 0px;
                                mso-text-raise: 9px;
                              "
                              >Access Support</span
                            ><span
                              ><!--[if mso
                                ]><i
                                  style="
                                    letter-spacing: 24px;
                                    mso-font-width: -100%;
                                  "
                                  hidden
                                  >&nbsp;</i
                                ><!
                              [endif]--></span
                            ></a
                          >
                          
                            <p
                              style="font-size:14px;line-height:24px;margin:20px 0;color:#333;font-family:&#x27;Arial&#x27;, sans-serif;margin-bottom:20px"
                            >
                              If you have any further questions or need
                              immediate assistance, feel free to reply to this
                              email<a
                                href="mailto:undefined"
                                style="color:#5e6ad2;text-decoration:underline;font-family:&#x27;Arial&#x27;, sans-serif;font-size:14px"
                                target="_blank"
                              ></a
                              >.
                            </p>
                            <p
                              style="font-size:14px;line-height:24px;margin:20px 0;color:#333;font-family:&#x27;Arial&#x27;, sans-serif;margin-bottom:20px"
                            >
                              We appreciate your patience as we work to resolve
                              your inquiry promptly.
                            </p>
                            <p
                              style="font-size:14px;line-height:24px;margin:20px 0;color:#333;font-family:&#x27;Arial&#x27;, sans-serif;margin-bottom:20px"
                            >
                              Best regards,<br />Unifaires Support Team
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <hr
                      style="
                        width: 100%;
                        border: none;
                        border-top: 1px solid #eaeaea;
                      "
                    />
                    <table
                      align="center"
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="padding: 25px 35px"
                    >
                      <tbody>
                        <tr>
                          <td>
                            <p
                              style="font-size:12px;line-height:24px;margin:20px 0;color:#333;font-family:&#x27;Arial&#x27;, sans-serif;padding:0 20px;text-align:center"
                            >
                              Copyright © 2025-2026 Unifaires GmbH. All Rights
                              Reserved<br /><a
                                href="https://unifaires.com/terms"
                                style="color:#5e6ad2;text-decoration:underline;font-family:&#x27;Arial&#x27;, sans-serif;font-size:14px"
                                target="_blank"
                                >Terms of Service</a
                              >
                              <!-- -->|<!-- -->
                              <a
                                href="https://unifaires.com/privacy"
                                style="color:#5e6ad2;text-decoration:underline;font-family:&#x27;Arial&#x27;, sans-serif;font-size:14px"
                                target="_blank"
                                >Privacy Policy</a
                              >
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
`,
tracking_settings: {
  click_tracking: { enable: false, enable_text: false }, // Disable tracking
},
    };
    return sgMail
      .send(msg)
      .then(() => {
        return {
          status: 200,
          message: "token sent successfully",
        };
      })
      .catch((error) => {
        return {
          status: 400,
          error,
          message: "something went wrong ",
        };
      });
  }

  /**
   * Get JSON parse datas
   */
  getJSONParse(inputStr = "") {
    try {
      return JSON.parse(inputStr);
    } catch (error) {
      return undefined;
    }
  }

  /**
   * Send approve email
   */
  sendApproveEmail(job = undefined) {
    const contactObj = this.getJSONParse(job?.dataValues?.contact);
    const email =
      typeof contactObj?.[0]?.email === "string" ? contactObj[0].email : "";
    const jobUrl = `${process.env.FRONT_APP_URL}/career/${
      typeof job?.dataValues?.slug === "string" ? job.dataValues.slug : ""
    }`;
    const userFirstName =
      typeof contactObj?.[0]?.firstname === "string" &&
      contactObj[0].firstname.trim() !== ""
        ? contactObj[0].firstname.trim()
        : "user";
    const jobTitle =
      typeof job?.dataValues?.title === "string" ? job.dataValues.title : "";
    if (email.trim() !== "") {
      this.approveJob({ email, jobUrl, userFirstName, jobTitle });
    }
  }

  /**
   * Send approve email
   */
  sendApproveCourseEmail({ courseObj = undefined, userObj = undefined }) {
    const email = typeof userObj?.email === "string" ? userObj.email : "";
    const courseUrl = `${process.env.FRONT_APP_URL}/courses/${
      typeof courseObj?.slug === "string" ? courseObj.slug : ""
    }`;
    const userFirstName =
      typeof userObj?.firstname === "string" && userObj.firstname.trim() !== ""
        ? userObj.firstname.trim()
        : "user";
    const courseTitle =
      typeof courseObj?.title === "string" ? courseObj.title : "";
    if (email.trim() !== "") {
      this.approveCourse({
        email,
        courseUrl,
        userFirstName,
        courseTitle,
      });
    }
  }

  /**
   * Send approve funding email
   */
  sendApproveFundingEmail({ fundingObj = undefined, userObj = undefined }) {
    const email = typeof userObj?.email === "string" ? userObj.email : "";
    const fundingUrl = `${process.env.FRONT_APP_URL}/funding/${
      typeof fundingObj?.slug === "string" ? fundingObj.slug : ""
    }`;
    const userFirstName =
      typeof userObj?.firstname === "string" && userObj.firstname.trim() !== ""
        ? userObj.firstname.trim()
        : "user";
    const fundingTitle =
      typeof fundingObj?.title === "string" ? fundingObj.title : "";
    if (email.trim() !== "") {
      this.approveFunding({
        email,
        fundingUrl,
        userFirstName,
        fundingTitle,
      });
    }
  }

  /**
   * send mail after job approve
   */
  async approveJob({
    email = "",
    jobUrl = "",
    userFirstName = "",
    jobTitle = "",
  }) {
    const msg = {
      to: email,
      from: "support@tryunifaires.com",
      subject: `Approve ${jobTitle} job - Unifaires`,
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
  </head>
  <div
    style="
      display: none;
      overflow: hidden;
      line-height: 1px;
      opacity: 0;
      max-height: 0;
      max-width: 0;
    "
  >
    Job approve email
  </div>
  <body
    style="
      background-color: #f9f9f9;
      color: #333;
      font-family: Arial, sans-serif;
    "
  >
    <table
      align="center"
      width="100%"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="
        max-width: 48.5em;
        padding: 20px;
        margin: 0 auto;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      "
    >
      <tbody>
        <tr style="width: 100%">
          <td>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="background-color: #fff"
            >
              <tbody>
                <tr>
                  <img
                    alt="Unifaires Logo"
                    height="45"
                    src="https://dev-api.tryunifaires.com/images/Unifaires%20New%20Logo_024703.png"
                    style="
                      display: block;
                      outline: none;
                      border: none;
                      text-decoration: none;
                    "
                    width="150"
                  />
                </tr>
                <tr>
                  <td>
                    <table
                      align="center"
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="padding: 25px 35px"
                    >
                      <tbody>
                        <tr>
                          <td>
                            <div
                              style="
                                font-size: 16px;
                                line-height: 24px;
                                margin: 20px 3em;
                                color: #333;
                                font-family: Arial, sans-serif;
                              "
                            >
                              Hello ${userFirstName}
                            </div>
                            <p
                              style="
                                font-size: 16px;
                                line-height: 24px;
                                margin: 20px 3em;
                                color: #333;
                                font-family: Arial, sans-serif;
                              "
                            >
                              Your job has been approved.
                            </p>
                            <hr
                              style="
                                width: 100%;
                                border: none;
                                border-top: 1px solid #eaeaea;
                              "
                            />
                            <p
                              style="
                                font-size: 14px;
                                line-height: 24px;
                                margin: 20px 3em;
                                color: #333;
                                font-family: Arial, sans-serif;
                              "
                            >
                              Unifaires is a comprehensive media and internet
                              content platform empowering users, organizations,
                              and educators to share, access, and monetize
                              diverse content across education, career, health,
                              news, and community-focused categories.
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td style="text-align: center">
                            <a
                              href="${jobUrl}"
                              style="
                                color: #333;
                                text-decoration: none;
                                font-family: Arial, sans-serif;
                                font-size: 14px;
                                background: rgb(245, 244, 245);
                                border-radius: 4px;
                                margin-bottom: 30px;
                                padding: 20px 10px;
                                width: 5rem;
                                font-weight: bold;
                              "
                              target="_blank"
                              >www.tryunifaires.com</a
                            >
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
`,
      tracking_settings: {
        click_tracking: { enable: false, enable_text: false }, // Disable tracking
      },
    };
    return sgMail
      .send(msg)
      .then(() => {
        return {
          status: 200,
          message: "Approve job notification sent successfully",
        };
      })
      .catch((error) => {
        return {
          status: 400,
          error,
          message: "something went wrong ",
        };
      });
  }

  /**
   * send mail after course approve
   */
  async approveCourse({
    email = "",
    courseUrl = "",
    userFirstName = "",
    courseTitle = "",
  }) {
    const msg = {
      to: email,
      from: "support@tryunifaires.com",
      subject: `Approve ${courseTitle} course - Unifaires`,
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html dir="ltr" lang="en">
    <head>
      <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
      <meta name="x-apple-disable-message-reformatting" />
    </head>
    <div
      style="
        display: none;
        overflow: hidden;
        line-height: 1px;
        opacity: 0;
        max-height: 0;
        max-width: 0;
      "
    >
      Job approve email
    </div>
    <body
      style="
        background-color: #f9f9f9;
        color: #333;
        font-family: Arial, sans-serif;
      "
    >
      <table
        align="center"
        width="100%"
        border="0"
        cellpadding="0"
        cellspacing="0"
        role="presentation"
        style="
          max-width: 48.5em;
          padding: 20px;
          margin: 0 auto;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        "
      >
        <tbody>
          <tr style="width: 100%">
            <td>
              <table
                align="center"
                width="100%"
                border="0"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="background-color: #fff"
              >
                <tbody>
                  <tr>
                    <img
                      alt="Unifaires Logo"
                      height="45"
                      src="https://dev-api.tryunifaires.com/images/Unifaires%20New%20Logo_024703.png"
                      style="
                        display: block;
                        outline: none;
                        border: none;
                        text-decoration: none;
                      "
                      width="150"
                    />
                  </tr>
                  <tr>
                    <td>
                      <table
                        align="center"
                        width="100%"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="padding: 25px 35px"
                      >
                        <tbody>
                          <tr>
                            <td>
                              <div
                                style="
                                  font-size: 16px;
                                  line-height: 24px;
                                  margin: 20px 3em;
                                  color: #333;
                                  font-family: Arial, sans-serif;
                                "
                              >
                                Hello ${userFirstName}
                              </div>
                              <p
                                style="
                                  font-size: 16px;
                                  line-height: 24px;
                                  margin: 20px 3em;
                                  color: #333;
                                  font-family: Arial, sans-serif;
                                "
                              >
                                Your course has been approved.
                              </p>
                              <hr
                                style="
                                  width: 100%;
                                  border: none;
                                  border-top: 1px solid #eaeaea;
                                "
                              />
                              <p
                                style="
                                  font-size: 14px;
                                  line-height: 24px;
                                  margin: 20px 3em;
                                  color: #333;
                                  font-family: Arial, sans-serif;
                                "
                              >
                                Unifaires is a comprehensive media and internet
                                content platform empowering users, organizations,
                                and educators to share, access, and monetize
                                diverse content across education, career, health,
                                news, and community-focused categories.
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td style="text-align: center">
                              <a
                                href="${courseUrl}"
                                style="
                                  color: #333;
                                  text-decoration: none;
                                  font-family: Arial, sans-serif;
                                  font-size: 14px;
                                  background: rgb(245, 244, 245);
                                  border-radius: 4px;
                                  margin-bottom: 30px;
                                  padding: 20px 10px;
                                  width: 5rem;
                                  font-weight: bold;
                                "
                                target="_blank"
                                >www.tryunifaires.com</a
                              >
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </body>
  </html>
  `,
      tracking_settings: {
        click_tracking: { enable: false, enable_text: false }, // Disable tracking
      },
    };
    return sgMail
      .send(msg)
      .then(() => {
        return {
          status: 200,
          message: "Approve job notification sent successfully",
        };
      })
      .catch((error) => {
        return {
          status: 400,
          error,
          message: "something went wrong ",
        };
      });
  }

  /**
   * send mail after funding approve
   */
  async approveFunding({
    email = "",
    fundingUrl = "",
    userFirstName = "",
    fundingTitle = "",
  }) {
    const msg = {
      to: email,
      from: "support@tryunifaires.com",
      subject: `Approve ${fundingTitle} funding - Unifaires`,
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html dir="ltr" lang="en">
    <head>
      <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
      <meta name="x-apple-disable-message-reformatting" />
    </head>
    <div
      style="
        display: none;
        overflow: hidden;
        line-height: 1px;
        opacity: 0;
        max-height: 0;
        max-width: 0;
      "
    >
      Job approve email
    </div>
    <body
      style="
        background-color: #f9f9f9;
        color: #333;
        font-family: Arial, sans-serif;
      "
    >
      <table
        align="center"
        width="100%"
        border="0"
        cellpadding="0"
        cellspacing="0"
        role="presentation"
        style="
          max-width: 48.5em;
          padding: 20px;
          margin: 0 auto;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        "
      >
        <tbody>
          <tr style="width: 100%">
            <td>
              <table
                align="center"
                width="100%"
                border="0"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="background-color: #fff"
              >
                <tbody>
                  <tr>
                    <img
                      alt="Unifaires Logo"
                      height="45"
                      src="https://dev-api.tryunifaires.com/images/Unifaires%20New%20Logo_024703.png"
                      style="
                        display: block;
                        outline: none;
                        border: none;
                        text-decoration: none;
                      "
                      width="150"
                    />
                  </tr>
                  <tr>
                    <td>
                      <table
                        align="center"
                        width="100%"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="padding: 25px 35px"
                      >
                        <tbody>
                          <tr>
                            <td>
                              <div
                                style="
                                  font-size: 16px;
                                  line-height: 24px;
                                  margin: 20px 3em;
                                  color: #333;
                                  font-family: Arial, sans-serif;
                                "
                              >
                                Hello ${userFirstName}
                              </div>
                              <p
                                style="
                                  font-size: 16px;
                                  line-height: 24px;
                                  margin: 20px 3em;
                                  color: #333;
                                  font-family: Arial, sans-serif;
                                "
                              >
                                The funding you created has been approved.
                              </p>
                              <hr
                                style="
                                  width: 100%;
                                  border: none;
                                  border-top: 1px solid #eaeaea;
                                "
                              />
                              <p
                                style="
                                  font-size: 14px;
                                  line-height: 24px;
                                  margin: 20px 3em;
                                  color: #333;
                                  font-family: Arial, sans-serif;
                                "
                              >
                                Unifaires is a comprehensive media and internet
                                content platform empowering users, organizations,
                                and educators to share, access, and monetize
                                diverse content across education, career, health,
                                news, and community-focused categories.
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td style="text-align: center">
                              <a
                                href="${fundingUrl}"
                                style="
                                  color: #333;
                                  text-decoration: none;
                                  font-family: Arial, sans-serif;
                                  font-size: 14px;
                                  background: rgb(245, 244, 245);
                                  border-radius: 4px;
                                  margin-bottom: 30px;
                                  padding: 20px 10px;
                                  width: 5rem;
                                  font-weight: bold;
                                "
                                target="_blank"
                                >www.tryunifaires.com</a
                              >
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </body>
  </html>
  `,
      tracking_settings: {
        click_tracking: { enable: false, enable_text: false }, // Disable tracking
      },
    };
    return sgMail
      .send(msg)
      .then(() => {
        return {
          status: 200,
          message: "Approve job notification sent successfully",
        };
      })
      .catch((error) => {
        return {
          status: 400,
          error,
          message: "something went wrong ",
        };
      });
  }
}

module.exports = new SendGridServices();
