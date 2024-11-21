class mediaModel {
  constructor(
    title,
    path,
    category,
    status,
    description,
    metadata,
    createdAt,
    updatedAt
  ) {
    this.title = title;
    this.path = path;
    this.category = category;
    this.status = status;
    this.description = description;
    this.metadata = metadata;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
  fromJson(jsonData) {
    return new mediaModel(
      jsonData.title ?? "",
      jsonData.path ?? "",
      jsonData.category ?? "",
      jsonData.status ?? "",
      jsonData.description ?? "",
      jsonData.metadata ?? "",
      jsonData.createdAt ?? new Date(),
      jsonData.updatedAt ?? new Date()
    );
  }
  toDatabaseJson() {
    return {
      title: this.title,
      path: this.path,
      category: this.category,
      status: this.status,
      description: this.description,
      metadata: this.metadata,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
  toClientJson() {
    return {
      title: this.title,
      path: this.path,
      category: this.category,
      status: this.status,
      description: this.description,
      metadata: this.metadata,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
  toUpdateJson() {
    return {
      title: this.title,
      path: this.path,
      category: this.category,
      status: this.status,
      description: this.description,
      metadata: this.metadata,
      updatedAt: this.updatedAt,
      createdAt: this.createdAt,
    };
  }
}

export default mediaModel;
