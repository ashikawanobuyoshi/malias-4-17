<template>
  <div>
    <h2>お気に入り画像の詳細</h2>
    <div v-if="selectedImage">
      <img :src="selectedImage.url" alt="Favorite Image" />
      <p>ファイル名: {{ selectedImage.fileName }}</p>
      <button @click="removeFavorite">お気に入りから削除</button>
      <NuxtLink to="/favorites/all">戻る</NuxtLink>
    </div>
    <div v-else>
      <p>画像が見つかりません</p>
      <NuxtLink to="/favorites/all">戻る</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useFavoritesStore } from '@/stores/favorites'
import { serializeJson } from '@/utils/jsonUtils';

const result = serializeJson('{"key": "value"}');
console.log(result);

// 必要なデータを取得する
const route = useRoute()
const router = useRouter()
const favoritesStore = useFavoritesStore()

// ルートパラメータから選択された画像のIDを取得
const id = Number(route.params.id)
console.log('Route params:', route.params) // デバッグ: ルートパラメータの確認
console.log('Received ID:', id) // デバッグ: 取得したIDの確認

// お気に入りリストから画像を取得
const selectedImage = id >= 0 && id < favoritesStore.favoriteImages.length ? favoritesStore.favoriteImages[id] : null
console.log('Selected Image:', selectedImage) // デバッグ: 画像データの確認

// お気に入り画像を削除する処理
const removeFavorite = () => {
  if (selectedImage) {
    favoritesStore.removeFavorite(id)
    router.push('/favorites/all') // 削除後に一覧ページへ移動
  }
}
</script>

<style scoped>
img {
  max-width: 300px;
  height: auto;
  display: block;
  margin-bottom: 20px;
}
button {
  background-color: #ff9800;
  color: #fff;
  color: #fff;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: #e68900;
}
</style>