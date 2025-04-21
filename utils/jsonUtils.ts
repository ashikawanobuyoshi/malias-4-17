export function serializeJson(data: any): string {
  try {
    return JSON.stringify(data);
  } catch (error) {
    console.error("シリアライズエラー:", error);
    return "[]";
  }
}

export function deserializeJson(jsonString: string): any {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("デシリアライズエラー:", error);
    return [];
  }
}