class UserModel {
    constructor(
      fullName,
      password,
      sponsorId,
      email,
      phone,
      image,
      dob,
      status,
      role,
      isVerified,
      rewardId,
      initial,
      qualification,
      occupation,
      createdAt,
      updatedAt
    ) {
      
      this.fullName = fullName;
      this.password = password;
      this.sponsorId = sponsorId;
      this.email = email;
      this.phone = phone;
      this.image = image;
      this.dob = dob;
      this.status = status;
      this.role = role;
      this.isVerified = isVerified;
      this.rewardId = rewardId;
      this.initial=initial;
      this.qualification=qualification;
      this.occupation=occupation;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    }
  
    fromJson(jsonData) {
      return new UserModel(
       
        jsonData.fullName ?? "Not Available",
        jsonData.password,
        jsonData.sponsorId ?? "",
        jsonData.email ?? "",
        jsonData.phone,
        jsonData?.image ?? "",
        jsonData.dob ?? "dd-mm-yyyy",
        jsonData.status != null ? JSON.parse(jsonData.status) : false,
        jsonData.role ?? "admin",
        jsonData?.isVerified != null ? JSON.parse(jsonData.isVerified) : false,
        jsonData.rewardId ?? [],
        jsonData.initial ?? "",
        jsonData.qualification = "",
        jsonData.occupation="",
        jsonData.createdAt ?? new Date(),
        jsonData.updatedAt ?? new Date()
      );
    }
  
  
    // Function to convert User instance to a JSON object suitable for database insertion
    toDatabaseJson() {
      return {
       
        fullName: this.fullName,
        password: this.password,
        sponsorId: this.sponsorId,
        email: this.email,
        phone: this.phone,
        image: this.image,
        dob: this.dob,
        status: this.status,
        role: this.role,
        isVerified: this.isVerified,
        rewardId: this.rewardId,
        initial:this.initial,
        qualification:this.qualification,
        occupation:this.occupation,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
      };
    }
  
    // Data to client
    toClientJson() {
      return {
        
        fullName: this.fullName,
        sponsorId: this.sponsorId,
        email: this.email,
        phone: this.phone,
        image: this.image,
        dob: this.dob,
        status: this.status,
        role: this.role,
        
        isVerified: this.isVerified,
        rewardId: this.rewardId,
        initial:this.initial,
        qualification:this.qualification,
        occupation:this.occupation,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
      };
    }
  
    // toMemberJson(e) {
    //   return {
    //     userId: e.userId,
    //     id: e.userId,
    //     fullName: e.fullName,
    //     sponsorId: e.sponsorId,
    //     email: e.email,
    //     phone: e.phone,
    //     status: e.status,
    //     isVerified: e.isVerified,
    //     createdAt: e.createdAt,
    //   };
    // }
  
    toUpdateJson(body) {
      const updateJson = {};
   
      for (const key in body) {
        if (key !== "id" && this.hasOwnProperty(key) && body[key] !== undefined && body[key] !== "") {
          let value = body[key];
  
          // Convert string representation of boolean to actual boolean
          if (value === "true" || value === "false") {
            value = value === "true";
          }
  
          // Convert string representation of number to actual number
          const parsedNumber = parseFloat(value);
          if (!isNaN(parsedNumber)) {
            value = parsedNumber;
          }
  
          updateJson[key] = value;
        }
      }
  
      updateJson.updatedAt = new Date();
      
      return updateJson;
    }
  
  }
  
  export default UserModel;
  