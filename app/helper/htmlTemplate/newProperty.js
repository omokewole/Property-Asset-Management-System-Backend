import mjml2html from "mjml";

export function generatePropertyAddedEmail(property) {
	if (!property) {
		throw new Error("Invalid tenant data provided");
	}

	const date = new Date();
	const year = date.getFullYear();

	const mjmlTemplate = `<mjml>
    <mj-body background-color="#ffffff">
    <mj-section background-color="#0077B6" padding="20px 0">
    <mj-column>

      <mj-image align="left" width="100px" src="https://i.ibb.co/7SVhyvB/white-logo.png"></mj-image>
    </mj-column>
  </mj-section>
      <mj-section>
        <mj-column>
          <mj-text font-size="22px" align="left">Tenant Added to Your Property Portfolio!</mj-text>
          <mj-text font-size="14px">Hello ${property.owner_id.name},</mj-text>
          <mj-text >
          Congratulations! You’ve successfully added a new property to your Upville Homes account. Here are the details:          </mj-text>
        </mj-column>
      </mj-section>
      <mj-section>
        <mj-column>
          <mj-text font-size="16px">Property Details:</mj-text>
          <mj-text  color="#667185">
            Property Name:
            <span style="color: #212121; font-weight: 400;">${property.title}</span>
          </mj-text>
  
          <mj-text  color="#667185">Location: <span style="color: #212121; font-weight: 400;">${property.location}</span></mj-text>
          <mj-text  color="#667185">Property Type: <span style="color: #212121; font-weight: 400;">${property.property_type}</span></mj-text>
          <mj-text  color="#667185">Address: <span style="color: #212121; font-weight: 400;">${property.street}</span> 
          </mj-text>
          <mj-text  color="#667185">Number of Units: <span style="color: #212121; font-weight: 400;">${property.unit_number}</span> 
                     </mj-text>
       
          
        </mj-column>
      </mj-section>
      <mj-section>
        <mj-column>
          <mj-text font-size="16px">You can now:</mj-text>
          <mj-text ><span style="color: #212121; font-weight: 400;">&#x2022;</span> Add and manage tenant details for this property.</mj-text>
          <mj-text ><span style="color: #212121; font-weight: 400;">&#x2022;</span> Track lease agreements and payment records.</mj-text>
          <mj-text ><span style="color: #212121; font-weight: 400;">&#x2022;</span> Monitor maintenance schedules and property performance.</mj-text>
  
          <mj-text >
            Thank you for using Upville Homes to simplify property management!
          </mj-text>
          <mj-text >Warm Regards,
          </mj-text>
          <mj-text >The Upville Homes Team</mj-text>
        </mj-column>
      </mj-section>
      <mj-section>
        <mj-column>
          <mj-divider border-width="1px" border-color="#C1C1C1"></mj-divider>
          <mj-text font-size="14px" padding="25px 0" align="center" color="#667185">Copyright © ${year} Upville Homes. All Rights Reserved</mj-text>
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
