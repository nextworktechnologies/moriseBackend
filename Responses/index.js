// ***********************________________successResponse________________***********************
export const kycRequired = {
  status: 200,
  message:
    "Your KYC has been Generated Successfully. Please Submit your Valid documents for Activation.",
};
export const kycDone = {
  status: 200,
  message:
    "Thank You for joining Morise! Your kYC has been submitted successfully. Your profile is in review. You will receive a email soon.",
};

export const fetched = (column) => {
  return {
    status: 200,
    message: `${column} details are ready!`,
  };
};
export const columnUpdated = (type) => {
  return {
    status: 200,
    message: `${type} has been updated Successfully!`,
  };
};

export const deleted = (table) => {
  return {
    status: 200,
    message: `${table} has been deleted Successfully`,
  };
};
export const accountCreated = (userId, name) => {
  return `
  <!DOCTYPE html>
  <html>
      <body>
          <p>Hello ${name},</p><br/><br/>
          
          <p>We wanted to inform you that your account has been successfully created with Knoone India Limited.</p>
          <p>Currently, your account is under review by our team. You will be notified as soon as the review process is complete.</p>
          <ul>
            <li><strong>User ID:</strong> ${userId}</li>
          </ul>
          <p>If you have any questions or concerns in the meantime, please feel free to reach out to us. We're here to help!</p>
          <br/>
          <p>Thank you for choosing Knoone India Limited. We appreciate your patience and look forward to serving you.</p>
          <br/>
          <p>Best Regards,</p>
          <p>The Knoone India Limited Team</p>
      </body>
  </html>
  `;
};

export const kycRejected = (name, userId) => {
  return `
  <!DOCTYPE html>
  <html>
      <body>
          <p>Hello ${name},</p><br/><br/>
          
          <p>Hope this mail finds you well. This is to inform you that either your KYC has been expired or rejected. You will not be able to use your Nextowrk Account until your KYC will be updated.</p>
          <p>Knoone India requests you to please resubmit your KYC with updated documents.</p>
          <ul>
            <li><strong>User ID:</strong> ${userId}</li>
          </ul>
          <p>If you have any questions or concerns in the meantime, please feel free to reach out to us. We're here to help!</p>
          <br/>
          <p>Thank you for choosing Knoone India Limited. We appreciate your patience and look forward to serving you.</p>
          <br/>
          <p>Best Regards,</p>
          <p>The Knoone India Limited Team</p>
      </body>
  </html>
  `;
};

export const subAccCreated = "Your Knomastree Account Profile is Under Review";

// ***********************________________ Unauthorized Request ________________***********************
export const unauthorized = {
  status: 401,
  message: "Unauthorized Request",
};


// ***********************________________ Error Response ________________***********************

export const authAdmin = {
  status: 400,
  message: "You are not an legal authorized person.",
};

export const serverError = {
  status: 500,
  message: "Internal Server Error - Wrong Information or Network Error",
};

export const InvalidId = (type) => {
  return {
    status: 400,
    type: `invalid`,
    message: `Invalid ${type} ID`,
  };
};

export const kycExist = {
  status: 400,
  message: "You are already verified or using registered user documents!",
};

export const tryAgain = {
  status: 400,
  message:
    "Something went wrong, please check the information you provide or try again later",
};

export const noAddress = {
  status: 400,
  message:
    "No address was found for mentioned User Id. Kindly add Address First.",
};

export const notExist = (collection) => {
  return {
    status: 404,
    message: `${collection} not found`,
  };
};