import mjml2html from "mjml";

export function generateConfirmationEmail(user) {
	if (!user) {
		throw new Error("Invalid user name data provided");
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
          <mj-text font-size="22px" align="left">Thank You for Verifying Your Email!</mj-text>
          <mj-text  font-size="14px">Hello ${user.name},</mj-text>
          <mj-text >
            Welcome to Upville Homes, where property management meets simplicity. We’re excited to have you on board!
          </mj-text>
          <mj-text>Your email address has been successfully verified, and your account is now ready to use. Get started today to explore features that simplify managing your properties and tenants:</mj-text>
        </mj-column>
      </mj-section>  
      <mj-section>
        <mj-column>
          <mj-text><span style="color: #212121; font-weight: 400;">&#x2022;</span> Add and track properties easily.</mj-text>
          <mj-text><span style="color: #212121; font-weight: 400;">&#x2022;</span>View tenant details and payment history.</mj-text>
          <mj-text><span style="color: #212121; font-weight: 400;">&#x2022;</span> Update tenant information as needed.</mj-text>
  
          <mj-text>We’re excited about the opportunity to support you and your business goals.
          </mj-text>
          <mj-text>Click the button below to log in and begin your journey with us:</mj-text>
         
        </mj-column>
      </mj-section>
      <mj-section>
        <mj-column>
             <mj-text><a style="background-color: #0077B6; padding: 20px; color:white; text-decoration:none" href="${process.env.CLIENT_URL}/auth/login">Log in to Upville homes </a></mj-text>
           <mj-text padding-top="30px">Warm Regards,
          </mj-text>
          <mj-text>The Upville Homes Team</mj-text>
        </mj-column>
      </mj-section>
      <mj-section>
        <mj-column>
          <mj-divider border-width="2px" border-color="#C1C1C1"></mj-divider>
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
