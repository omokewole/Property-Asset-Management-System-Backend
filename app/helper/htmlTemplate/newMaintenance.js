import mjml2html from "mjml";
import { formatDate } from "../../utils/formatDate.js";

export function generateMaintenanceAddedEmail(maintenance) {
	if (!maintenance) {
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
          <mj-text font-size="22px" align="left">Property Maintenance Scheduled Successfully!</mj-text>
          <mj-text font-weight="400" font-size="14px">Hello ${
						maintenance.owner_id.name
					},</mj-text>
         <mj-text font-weight="300">Great news!</mj-text>
          <mj-text font-weight="300">Maintenance has been schedule for your property.</mj-text>
          <mj-text font-weight="300">Here are the details:</mj-text>
        </mj-column>
      </mj-section>
      <mj-section>
        <mj-column>
          <mj-text font-size="16px" font-weight="400">Property Details:</mj-text>
          <mj-text font-weight="300" color="#667185">
            Property Name:
            <span style="color: #212121; font-weight: 400;">${
							maintenance.property.name
						}</span>
          </mj-text>
  
          <mj-text font-weight="300" color="#667185">Facility: <span style="color: #212121; font-weight: 400;">${
						maintenance.facility
					}</span></mj-text>
          <mj-text font-weight="300" color="#667185">Scheduled Maintenance: <span style="color: #212121; font-weight: 400;">${formatDate(
						maintenance.schedule_date
					)}</span></mj-text>
          <mj-text font-weight="300" color="#667185">Assigned Technician: <span style="color: #212121; font-weight: 400;">${
						maintenance.technician
					}</span> 
          </mj-text>
          <mj-text font-weight="300" color="#667185">Task Status: <span style="color: #212121; font-weight: 400;">${
						maintenance.status
					}</span></mj-text>          
        </mj-column>
      </mj-section>
      <mj-section>
        <mj-column>
          <mj-text font-size="16px" font-weight="400">You can now:</mj-text>
          <mj-text font-weight="300"><span style="color: #212121; font-weight: 400;">&#x2022;</span> Add and manage tenant details for this property.</mj-text>
          <mj-text font-weight="300"><span style="color: #212121; font-weight: 400;">&#x2022;</span> Track lease agreements and payment records.</mj-text>
          <mj-text font-weight="300"><span style="color: #212121; font-weight: 400;">&#x2022;</span> Monitor maintenance schedules and property performance.</mj-text>
          <mj-text font-weight="300">
          Keeping your property well-maintained ensures tenant satisfaction and preserves its value.
          </mj-text>
          <mj-text font-weight="300">
          If you need to modify this schedule or add more tasks, you can manage everything in your dashboard.
          </mj-text>
          <mj-text font-weight="300">Warm Regards,
          </mj-text>
          <mj-text font-weight="300">The Upville Homes Team</mj-text>
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
