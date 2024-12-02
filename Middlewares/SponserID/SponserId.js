import collections from "../../Collections/collections.js";


const generateSponsorID = () => {
  return Math.floor(10000000 + Math.random() * 90000000); // 8-digit number between 10000000 and 99999999
};

// Function to ensure unique sponsor ID
export  const generateUniqueSponsorID = async () => {
  let sponsorID;
  let isUnique = false;

  // Loop until we find a unique sponsor ID
  while (!isUnique) {
    sponsorID = generateSponsorID();

    // Check if the sponsor ID already exists in the database
    const existingUser = await collections.userCollection().findOne({ sponsorID });

    if (!existingUser) {
      // Sponsor ID is unique
      isUnique = true;
    }
  }

  return sponsorID;
};