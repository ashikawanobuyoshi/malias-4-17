<template>
  <div class="container">
    <h2>お気に入り画像一覧</h2>
    <!-- もどるボタン -->
    <div class="back-button">
      <NuxtLink to="/">
        <button class="back-btn">もどる</button>
      </NuxtLink>
    </div>
  </div>
  
  <!-- favorites gallery -->
  <div class="favorites-gallery">
    <div v-if="favoritesStore.favoriteImages.length === 0">
      お気に入り画像はありません
    </div>
    <div
      v-else
      v-for="(favImg, index) in favoritesStore.favoriteImages"
      :key="index"
      class="favorite-item"
      @click="favoritesStore.removeFavorite(index)"
    >
      <img :src="favImg.url" alt="Favorite Image" />
      <div class="fav-image-name">{{ favImg.fileName }}</div>
    </div>
  </div>

  <h2>お気に入り画像の仕上げ方</h2>

  <!-- print images gallery (5列 × 4行 / 合計20アイテム) -->
  <div class="print-gallery">
    <div
      v-for="(img, index) in printImages"
      :key="index"
      class="print-item"
    >
      <!-- 商品明細ページへのリンク -->
      <NuxtLink :to="getDetailUrl(img.productId)">
        <img :src="img.src" :style="img.style" :alt="img.description" />
      </NuxtLink>
      <div class="print-description">{{ img.description }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFavoritesStore } from '@/stores/favorites'
import { printImages } from '@/data/printImages' // インポート
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';

const favoritesStore = useFavoritesStore();
const { favoriteImages } = storeToRefs(favoritesStore);

// 商品明細ページの URL を生成する関数
const getDetailUrl = (productId: number) => {
  return `/product-details/${productId}`
}

// お気に入り画像を削除する関数
const removeFavorite = (index: number) => {
  favoritesStore.value.removeFavorite(index)
}
</script>

<style scoped>
/* コンテナー全体 */
.container {
  padding: 20px;
  width: 100%; /* または必要に応じて固定値 */
}

/* お気に入りギャラリーのラッパー（背景や余白は必要に応じて調整） */
.favorites-gallery {
  margin-bottom: 3%;
  display: grid;
  /* 自動フィット: 最小幅200px、余裕があれば1fr（均等割り）に */
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;  /* ※ gap を 10px に変更 */
}

/* 各お気に入り画像アイテム */
.favorite-item {
  cursor: pointer;
  /* grid を利用するため、width 指定は不要となります */
}

/* 画像自体のスタイル：コンテナー内で横幅100%、最大150px */
.favorite-item img {
  width: 100%;
  max-width: 150px;
  border: 1px solid #ccc;
  display: block;
  margin: 0 auto; /* 中央寄せになるよう設定 */
}

/* 画像タイトルなどの補助テキスト */
.fav-image-name {
  text-align: center;
  font-size: 14px;
  margin-top: 5px;
  background: rgba(255, 255, 255, 0.9);
  padding: 4px;
  border-radius: 4px;
  overflow-wrap: break-word;
}

/* もどるボタンなどの追加スタイル */
.back-button {
  margin-bottom: 20px;
}

.back-btn {
  padding: 6px 12px;
  background-color: #007bff;
  border: none;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
}
.print-gallery {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

.print-item {
  text-align: center;
}

.print-item img {
  max-width: 100%;
  height: auto;
}

.print-description {
  white-space: pre-wrap;
  margin-top: 8px;
}
</style>