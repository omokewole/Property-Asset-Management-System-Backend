import mjml2html from "mjml";

export function generateVerificationEmail(user) {
  
	if (!user) {
		throw new Error("Invalid user data provided");
	}

	const date = new Date();
	const year = date.getFullYear();

	const mjmlTemplate = `<mjml>
    <mj-body background-color="#ffffff">
      <mj-section background-color="#0077B6" padding="20px 0">
        <mj-column>
  
          <mj-image align="left" width="150px" src="https://i.ibb.co/7SVhyvB/white-logo.png"></mj-image>
        </mj-column>
      </mj-section>
      <mj-section>
        <mj-column>
          <mj-text font-size="22px" align="left">Please Verify Your Email!</mj-text>
          <mj-text font-weight="400" font-size="14px">Hello ${user.name},</mj-text>
          <mj-text font-weight="300">
            Welcome to Upville Homes, We are happy to sign you up. To start exploring Upville Homes, please confirm your email address
          </mj-text>
  
        </mj-column>
      </mj-section>
  
      <mj-section>
        <mj-column>
          <mj-text><a style="background-color: #0077B6; padding: 20px; color:white; text-decoration:none" href="${process.env.CLIENT_URL}/auth/verify-email?emailToken=${user.email_token}">Verify Email Now</a></mj-text>
          <mj-text padding-top="30px" font-weight="300">Warm Regards,
          </mj-text>
          <mj-text font-weight="300">The Upville Homes Team</mj-text>
        </mj-column>
      </mj-section>
      <mj-section>
        <mj-column>
          <mj-divider border-width="1px" border-color="#C1C1C1"></mj-divider>
          <mj-text padding="25px 0" align="center" color="#667185">Copyright © ${year} Upville Homes. All Rights Reserved</mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>`;

	const { html, errors } = mjml2html(mjmlTemplate);

	if (errors.length > 0) {
		throw new Error(`MJML Conversion Errors: ${errors.join(", ")}`);
	}

	return html;
}
