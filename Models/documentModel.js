class documentModel {
  constructor(
    id,
    userId,
    addharCard,
    panCard,
    passport,
    marksheet,
    qualification,
    other,
    additional,
    nocSign,
    passportPhoto,
    createdAt,
    updatedAt
  ) {
    this.id = id;
    this.userId = userId;
    this.addharCard = addharCard;
    this.panCard = panCard;
    this.passport = passport;
    this.marksheet = marksheet;
    this.qualification = qualification;
    this.other = other;
    this.additional = additional;
    this.nocSign = nocSign;
    this.passportPhoto = passportPhoto;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  fromJson(jsonData) {
    return new documentModel(
      jsonData._id ?? null,
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
      jsonData.additional ?? "",
      jsonData.nocSign ?? "",
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
      additional: this.additional,
      nocSign: this.nocSign,
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
