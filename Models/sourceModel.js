class SourceModel {
    constructor(
      id,
      title,
      description,
      other,
      type,
      status,
      valide,
      createdAt,
      updatedAt
    ) {
      this.id = id;
      this.title = title;
      this.description = description;
      this.other = other;
      this.type = type;
      this.status = status;
      this.valide = valide;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    }
  
    fromJson(jsonData) {
      return new SourceModel(
        jsonData._id ?? null,
        jsonData.title,
        jsonData.description,
        jsonData.other,
        jsonData.type,
        jsonData.status != null ? JSON.parse(jsonData.status) : false,
        jsonData.valide != null ? JSON.parse(jsonData.status) : false,
        jsonData.createdAt ?? new Date(),
        jsonData.updatedAt ?? new Date()
      );
    }
  
    toDatabaseJson() {
  
      return {
        title: this.title,
        description: this.description,
        other: this.other,
        type: this.type,
        status: this.status,
        valide: this.valide,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
      };
    }
  
    toUpdateJson(body) {
      const updateJson = {};
  
      for (const key in body) {
        if (key != "id" && this.hasOwnProperty(key) && body[key] !== undefined && body[key] !== "") {
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
  
  export default SourceModel;