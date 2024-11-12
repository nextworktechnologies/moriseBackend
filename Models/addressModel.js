class AddressModel {
    constructor(
      id,
      userId,
      street,
      city,
      state,
      country,
      postalCode,
      createdAt,
      updatedAt
    ) {
      this.id = id;
      this.userId = userId;
      this.street = street;
      this.city = city;
      this.state = state;
      this.country = country;
      this.postalCode = postalCode;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    }
  
    fromJson(jsonData) {
      return new AddressModel(
        jsonData._id ?? null,
        jsonData.userId ?? "",
        jsonData.street ?? "",
        jsonData.city ?? "",
        jsonData.state ?? "",
        jsonData.country ?? "",
        jsonData.postalCode ?? 0,
        jsonData.createdAt ?? new Date(),
        jsonData.updatedAt ?? new Date()
      );
    }
  
    toDatabaseJson() {
      return {
        street: this.street,
        userId: this.userId,
        city: this.city,
        state: this.state,
        country: this.country,
        postalCode: this.postalCode,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
      };
    }
  
    toClient() {
      return {
        street: this.street,
        city: this.city,
        state: this.state,
        country: this.country,
        postalCode: this.postalCode,
      };
    }
  
    toUpdateJson(body) {
      const updateJson = {};
  
      for (const key in body) {
        if (key !== "id" && this.hasOwnProperty(key) && body[key] !== null && body[key] !== undefined && body[key] !== "") {
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
  
  export default AddressModel;
  