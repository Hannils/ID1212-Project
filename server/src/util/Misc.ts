export function isValidHttpUrl(url: string) {
    let checkUrl
    try {
      checkUrl = new URL(url);
    } catch (_) {
      return false;
    }
    return checkUrl.protocol === "http:" || checkUrl.protocol === "https:";
  }