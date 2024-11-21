class PaymentHistoryModel {
  constructor(
    userId,
    amount,
    type,
    transactionId,
    status,
    invoice,
    verification,
    createAt,
    updatedAt
  ) {
    this.userId = userId;
    this.amount = amount;
    this.type = type;
    this.transactionId = transactionId;
    this.status = status;
    this.invoice = invoice;
    this.verification = verification;
    this.createAt = createAt;
    this.updatedAt = updatedAt;
  }

  fromJson(jsonData) {
    return new PaymentHistoryModel(
      jsonData.userId ?? null,
      jsonData.amount ?? null,
      jsonData.type ?? "",
      jsonData.transactionId ?? null,
      jsonData.status ?? "",
      jsonData.invoice ?? null,
      jsonData.verification ?? null,
      jsonData.createAt ?? new Date(),
      jsonData.updatedAt ?? new Date()
    );
  }
  toDatabaseJson(invoiceNo) {
    return {
      userId: this.userId,
      amount: this.amount,
      type: this.type,
      transactionId: this.transactionId,
      status: this.status,
      invoice: invoiceNo,
      verification: this.verification,
      createAt: this.createAt,
      updatedAt: this.updatedAt,
    };
  }
  toClientJson(invoiceNo) {
    return {
      userId: this.userId,
      amount: this.amount,
      type: this.type,
      transactionId: this.transactionId,
      status: this.status,
      invoice: invoiceNo,
      verification: this.verification,
      createAt: this.createAt,
      updatedAt: this.updatedAt,
    };
  }
}

export default PaymentHistoryModel;
