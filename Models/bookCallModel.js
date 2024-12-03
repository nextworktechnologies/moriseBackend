class callModel {
  constructor(
    userId,
    phoneNo,
    dateAndTime,
    status = "pending",
    createdAt,
    updatedAt
  ) {
    this.userId = userId;
    this.phoneNo = phoneNo;
    this.dateAndTime = dateAndTime;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
  fromJson(jsonData) {
    return new callModel(
      jsonData.userId ?? null,
      jsonData.phoneNo ?? "",
      jsonData.dateAndTime ?? "",
      jsonData.status ?? "pending",
      jsonData.createdAt ?? new Date(),
      jsonData.updatedAt ?? new Date()
    );
  }
  toDatabaseJson() {
    return {
      userId: this.userId,
      phoneNo: this.phoneNo,
      dateAndTime: this.dateAndTime,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
  toClientJson() {
    return {
      userId: this.userId,
      phoneNo: this.phoneNo,
      dateAndTime: this.dateAndTime,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
  toUpdateJson() {
    return {
      phoneNo: this.phoneNo,
      dateAndTime: this.dateAndTime,
      status: this.status,
      updatedAt: this.updatedAt,
    };
  }
}

export default callModel;
