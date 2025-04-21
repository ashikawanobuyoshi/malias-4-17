<!-- components/FavoriteImages.vue -->
<template>
  <div class="favorites">
    <h3>お気に入り画像出力部</h3>

    <!-- 安全なプロパティ確認 -->
    <div v-if="favoritesStore?.favoriteImages?.length === 0">
      お気に入り画像はありません
    </div>

    <div v-else class="favorites-gallery">
      <div
        v-for="(favImg, index) in favoritesStore?.favoriteImages || []"
        :key="index"
        class="favorite-item"
        @click="removeFavorite(index)"
      >
        <img :src="favImg?.url || ''" alt="Favorite Image" />
        <div class="fav-image-name">{{ favImg?.fileName || 'Unnamed Image' }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFavoritesStore } from '@/stores/favorites'; // stores フォルダ内に favorites ストアを作成している前提

const favoritesStore = useFavoritesStore();

// デバッグ用ログ - favoriteImagesがundefinedの場合に備える
console.log('お気に入り画像:', favoritesStore?.favoriteImages);

function removeFavorite(index: number) {
  // インデックスが有効かどうかをチェック
  if (favoritesStore?.favoriteImages && index >= 0 && index < favoritesStore.favoriteImages.length) {
    favoritesStore.removeFavorite(index); // 有効な場合に削除
  } else {
    console.error('無効なインデックスです:', index); // 無効な場合のエラーログ
  }
}

const obj = { name: 'John', age: 30 };
const jsonString = JSON.stringify(obj);
const parsedObj = JSON.parse(jsonString);
console.log(parsedObj.name); // John

fetch('/api/data')
  .then(response => response.json()) // レスポンスを JSON として解析
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
</script>

<style scoped>
.favorites {
  padding: 20px;
  border: 1px solid #ddd;
  margin: 20px 0;
}
.favorites-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}
.favorite-item {
  cursor: pointer;
  border: 1px solid #ccc;
  padding: 5px;
  transition: border-color 0.3s;
}
.favorite-item:hover {
  border-color: #f0c14b;
}
.favorite-item img {
  width: 100px;
  height: 100px;
  object-fit: cover;
}
.fav-image-name {
  text-align: center;
  font-size: 0.9rem;
  margin-top: 5px;
}
</style>