class documentModel {
  constructor(
    userId,
    addharCard,
    panCard,
    passport,
    marksheet,
    qualification,
    other,
    cv,
    sign,
    passportPhoto,
    createdAt,
    updatedAt
  ) {
    this.userId = userId;
    this.addharCard = addharCard;
    this.panCard = panCard;
    this.passport = passport;
    this.marksheet = marksheet;
    this.qualification = qualification;
    this.other = other;
    this.cv = cv;
    this.sign = sign;
    this.passportPhoto = passportPhoto;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  fromJson(jsonData) {
    return new documentModel(
      jsonData.userId ?? null,
      [jsonData.aadharFront ?? "", jsonData.aadharBack ?? ""] ?? "",
      jsonData.panCard ?? "",
      jsonData.passport ?? "",
      [
        jsonData.matriculationCertificate ?? "",
        jsonData.intermediateCertificate ?? "",
        jsonData.graduationCertificate ?? "",
        jsonData.postGraduationCertificate ?? "",
      ] ?? "",
      jsonData.qualification ?? "",
      jsonData.other ?? "",
      jsonData.cv ?? "",
      jsonData.sign ?? "",
      jsonData.passportPhoto ?? "",
      jsonData.createdAt ?? new Date(),
      jsonData.updatedAt ?? new Date()
    );
  }
  toDatabaseJson() {
    return {
      userId: this.userId,
      addharCard: this.addharCard,
      panCard: this.panCard,
      passport: this.passport,
      marksheet: this.marksheet,
      qualification: this.qualification,
      other: this.other,
      cv: this.cv,
      sign: this.sign,
      passportPhoto: this.passportPhoto,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  // For client-side data - returns only necessary fields
  toClient() {
    return {
      addharCard: this.addharCard,
      panCard: this.panCard,
      passport: this.passport,
      marksheet: this.marksheet,
      qualification: this.qualification,
      passportPhoto: this.passportPhoto,
    };
  }

  // For handling updates
  toUpdateJson(body) {
    const updateJson = {};

    for (const key in body) {
      if (
        key !== "id" &&
        body[key] !== null &&
        body[key] !== undefined &&
        body[key] !== ""
      ) {
        const value = body[key];

        // Handle arrays by filtering out invalid items
        if (Array.isArray(value)) {
          updateJson[key] = value.filter(
            (item) => item !== null && item !== undefined && item !== ""
          );
        }
        // Explicitly handle file buffers by checking if the key is an object with a `buffer` property
        else if (typeof value === "object" && value.buffer instanceof Buffer) {
          updateJson[key] = value.buffer; // Use the buffer directly
        }
        // Otherwise, add the value directly
        else {
          updateJson[key] = value;
        }
      }
    }

    updateJson.updatedAt = new Date();
    return updateJson;
  }
}

export default documentModel;
