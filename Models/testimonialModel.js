class TestimonialModel {
    constructor(
      name,
      designation,
      description ,
      rating,
      video,
      createdAt,
      updatedAt
    ) {
      
      this.name = name;
      this.designation = designation;
      this.description = description;
      this.rating = rating;
      this.video = video;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    }
  
    fromJson(jsonData) {
      return new TestimonialModel(
        jsonData.name ?? "",
        jsonData.designation ?? "",
        jsonData.description ?? "",
        jsonData.rating ?? "",
        jsonData.video ?? "",
        jsonData.createdAt ?? new Date(),
        jsonData.updatedAt ?? new Date()
      );
    }
  
    toDatabaseJson() {
      return {
        name: this.name,
        designation: this.designation,
        description: this.description,
        rating: this.rating,
        video:this.video,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
      };
    }
  
    toClient() {
      return {
        name: this.name,
        designation: this.designation,
        description: this.description,
        country: this.rating,
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
  
  export default TestimonialModel;
  