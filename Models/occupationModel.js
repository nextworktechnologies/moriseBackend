class occupationModel {
  constructor(id, occupation, type, status, createdAt, updatedAt) {
    this.id = id;
    this.occupation = occupation;
    this.type = type;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
  fromJson(jsonData) {
    return new occupationModel(
      jsonData._id ?? null,
      jsonData.occupation ?? "",
      jsonData.type ?? "",
      jsonData.status ?? "",
      jsonData.createdAt ?? new Date(),
      jsonData.updatedAt ?? new Date()
    );
  }
  toDatabaseJson() {
    return {
      occupation: this.occupation,
      type: this.type,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
  toClientJson() {
    return {
      id: this.id,
      occupation: this.occupation,
      type: this.type,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
  toUpdateJson() {
    return {
      occupation: this.occupation,
      type: this.type,
      status: this.status,
      updatedAt: this.updatedAt,
    };
  }
}
