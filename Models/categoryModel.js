class CategoryModel {
    constructor(
      id,
      title,
      description,
      type,
      status,
      createdAt,
      updatedAt
    ) {
      this.id = id;
      this.title = title;
      this.description = description;
      this.type = type;
      this.status = status;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    }
  
    fromJson(jsonData) {
      return new CategoryModel(
        jsonData._id ?? null,
        jsonData.title ?? "",
        jsonData.description ?? "",
        jsonData.type ?? "",
        jsonData.status != null ? JSON.parse(jsonData.status) : false,
        jsonData.createdAt ?? new Date(),
        jsonData.updatedAt ?? new Date()
      );
    }
  
    toDatabaseJson() {
  
      return {
        userId: this.userId,
        title: this.title,
        description: this.description,
        type: this.type,
        status: this.status,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
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
  
  export default CategoryModel;