class QualificationModel {
    constructor(
      id,
      title,
      status,
      type,
      createdAt,
      updatedAt
    ) {
      this.id = id;
      this.title = title;
      this.status = status;
      this.type = type;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    }
  
    fromJson(jsonData) {
      return new QualificationModel(
        jsonData._id ?? null,
        jsonData.title ?? "",
        jsonData.status  != null ? JSON.parse(jsonData.status) : false,
        jsonData.type ?? "",
        jsonData.createdAt ?? new Date(),
        jsonData.updatedAt ?? new Date()
      );
    }
  
    toDatabaseJson() {
      return {
        title: this.title,
        status: this.status,
        type: this.type,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
      };
    }
  
    toClient() {
      return {
        title: this.title,
        status: this.status,
        type: this.type,
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
  
  export default QualificationModel;
  