class SubjectHandler {
  constructor() {
    this.currentSubject = "";
    this.action = "";
    this.imgIds = [];
    this.imgProccessing = false;
  }
  setSubject(subjectName) {
    if (typeof subjectName !== "string") {
      throw new TypeError("String type is expected.");
    }
    this.currentSubject = subjectName.toLowerCase();
  }
  getSubject() {
    return this.currentSubject;
  }
  setAction(actionName) {
    if (typeof actionName !== "string") {
      throw new TypeError("String type is expected");
    }

    this.action = actionName.toLowerCase();
  }
  getAction() {
    return this.action;
  }
  reset() {
    this.currentSubject = "";
    this.action = "";
    this.imgIds = [];
  }
  addImgId(imgId) {
    console.log("added image");
    if (typeof imgId !== "string") {
      throw new TypeError("String type is expected");
    }
    this.imgIds.push(imgId);
  }
  getImgIds() {
    return this.imgIds;
  }
}
module.exports = { SubjectHandler };
