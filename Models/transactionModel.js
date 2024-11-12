class UserTransactionModel {
    constructor(
      id,
      userId,
      amount,
      tax,
      type,
      tnxId,
      invoiceNo,
      status,
      paymentMethod,
      createdAt,
      updatedAt
    ) {
      this.id = id;
      this.userId = userId;
      this.amount = amount;
      this.tax = tax;
      this.type = type;
      this.tnxId = tnxId;
      this.invoiceNo = invoiceNo;
      this.status = status;
      this.paymentMethod = paymentMethod;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    }
  
    fromJson(jsonData) {
      return new UserTransactionModel(
        jsonData._id ?? null,
        jsonData.userId ?? "",
        jsonData.amount != null ? parseInt(jsonData.amount) : 0,
        jsonData.tax ?? 18,
        jsonData.type ?? "",
        jsonData.tnxId ?? "",
        jsonData.invoiceNo != null ? parseInt(jsonData.invoiceNo) : 0,
        jsonData.status != null ? JSON.parse(jsonData.status) : false,
        jsonData.paymentMethod ?? "NEFT",
        jsonData.createdAt ?? new Date(),
        jsonData.updatedAt ?? new Date()
      );
    }
  
    toDatabaseJson() {
  
      return {
        userId: this.userId,
        amount: this.amount,
        tax: this.tax,
        type: this.type,
        tnxId: this.tnxId,
        invoiceNo: this.invoiceNo,
        status: this.status,
        paymentMethod: this.paymentMethod,
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
  
  export default UserTransactionModel;