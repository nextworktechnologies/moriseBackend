class NotificationsModel {
    constructor(
      id,
      userId,
      title,
      sourceId,
      sourceType,
      status,
      icon,
      createdAt,
      updatedAt,
    ) {
      this.id = id;
      this.userId = userId;
      this.title = title;
      this.sourceId = sourceId;
      this.sourceType = sourceType;
      this.status = status;
      this.icon = icon;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    }
  
    fromJson(jsonData) {
      return new NotificationsModel(
        jsonData._id ?? null,
        jsonData.userId,
        jsonData.title,
        jsonData.sourceId,
        jsonData.sourceType,
        jsonData.status ?? false,
        jsonData.icon ?? "notifications",
        jsonData.createdAt ?? new Date(),
        jsonData.updatedAt ?? new Date()
      );
    }
  
    toDatabaseJson() {
      return {
        userId: this.userId,
        title: this.title,
        sourceId: this.sourceId,
        sourcetype: this.sourceType,
        status: this.status,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
      };
    }
  
    toUpdateJson(body) {
      const updateJson = {};
  
      for (const key in body) {
        if (this.hasOwnProperty(key) && body[key] !== null && body[key] !== undefined && body[key] !== "") {
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
  
  export default NotificationsModel;
  