export function serializeJson(data: any): string {
  return JSON.stringify(data);
}

export function deserializeJson(jsonString: string): any {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('JSON デシリアライズエラー:', error);
    return null; // または適切なデフォルト値を返す
  }
}