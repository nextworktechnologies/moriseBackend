class queryModel {
  constructor(
    userId,
    title,
    description,
    status = "open",
    createdAt,
    updatedAt
  ) {
    this.userId = userId;
    this.title = title;
    this.description = description;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
  fromJson(jsonData) {
    return new queryModel(
      jsonData.userId ?? null,
      jsonData.title ?? "",
      jsonData.description ?? "",
      jsonData.status ?? "open",
      "",
      jsonData.createdAt ?? new Date(),
      jsonData.updatedAt ?? new Date()
    );
  }
  toDatabaseJson() {
    return {
      userId: this.userId,
      title: this.title,
      description: this.description,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
  toClientJson() {
    return {

      userId: this.userId,
      title: this.title,
      description: this.description,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
  toUpdateJson() {
    return {
      title: this.title,
      description: this.description,
      status: this.status,
      updatedAt: this.updatedAt,
    };
  }
}

export default queryModel;
