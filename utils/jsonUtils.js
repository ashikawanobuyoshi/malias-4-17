export function serializeJson(string) {
    try {
      const parsedObject = JSON.parse(string);
      const serializedString = JSON.stringify(parsedObject);
      return serializedString;
    } catch (error) {
      console.error("JSON処理中にエラーが発生しました:", error);
      return null;
    }
  }