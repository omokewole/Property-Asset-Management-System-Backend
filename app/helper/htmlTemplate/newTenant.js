import mjml2html from "mjml";
import { formatDate } from "../../utils/formatDate.js";

export function generateTenantAddedEmail(tenant) {
	if (!tenant || !tenant.assigned_property) {
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
          <mj-text font-size="18px" align="left">Tenant Added to Your Property Portfolio!</mj-text>
          <mj-text font-weight="400" font-size="14px">Hello ${
						tenant.name
					},</mj-text>
          <mj-text font-weight="300">
            We’re excited to inform you that a new tenant has been successfully added to your Upville Homes account! Here are the details of the tenant:
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-section>
        <mj-column>
          <mj-text font-size="16px" font-weight="400">Tenant Details:</mj-text>
          <mj-text font-weight="300" color="#667185">
            Tenant Name:
            <span style="color: #212121; font-weight: 400;">${
							tenant.name
						}</span>
          </mj-text>
  
          <mj-text font-weight="300" color="#667185">Property: <span style="color: #212121; font-weight: 400;">${
						tenant.assigned_property.title
					}</span></mj-text>
          <mj-text font-weight="300" color="#667185">Unit: <span style="color: #212121; font-weight: 400;">${
						tenant.assigned_unit
					}</span></mj-text>
          <mj-text font-weight="300" color="#667185">Lease Start Date: <span style="color: #212121; font-weight: 400;">${formatDate(
						tenant.start_date
					)}</span> </mj-text>
          <mj-text font-weight="300" color="#667185">Lease End Date: <span style="color: #212121; font-weight: 400;">${formatDate(
						tenant.end_date
					)}</span> </mj-text>
        </mj-column>
      </mj-section>
      <mj-section>
        <mj-column>
          <mj-text font-size="16px" font-weight="400">You can now:</mj-text>
          <mj-text font-weight="300"><span style="color: #212121; font-weight: 400;">&#x2022;</span> View and manage this tenant’s payment history.</mj-text>
          <mj-text font-weight="300"><span style="color: #212121; font-weight: 400;">&#x2022;</span> Track their lease and occupancy details.</mj-text>
          <mj-text font-weight="300"><span style="color: #212121; font-weight: 400;">&#x2022;</span> Update tenant information as needed.</mj-text>
  
          <mj-text font-weight="300">
            Thank you for using Upville Homes to simplify property management!
          </mj-text>
          <mj-text font-weight="300">Warm Regards,
          </mj-text>
          <mj-text font-weight="300">The Upville Homes Team</mj-text>
        </mj-column>
      </mj-section>
      <mj-section>
        <mj-column>
          <mj-divider border-width="1px" border-color="#C1C1C1"></mj-divider>
          <mj-text font-size="12px" padding="15px 0" align="center" color="#667185">Copyright © ${year} Upville Homes. All Rights Reserved</mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>`;

	const { html, errors } = mjml2html(mjmlTemplate);


  console.log(errors)

	if (errors.length > 0) {
		throw new Error(`MJML Conversion Errors: ${errors.join(", ")}`);
	}



	return html;
}
