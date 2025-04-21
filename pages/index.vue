<template>
  <div class="image-selector">
    <!-- モニター部 -->
    <div class="monitor-container">
      <div class="monitor monitor-left">
        <div class="image-wrapper">
          <img :src="leftImage.url" :alt="leftImage.fileName" />
        </div>
        <div class="image-name">{{ leftImage.fileName }}</div>
      </div>
      <div class="monitor monitor-right">
        <div class="image-wrapper">
          <img :src="rightImage.url" :alt="rightImage.fileName" />
        </div>
        <div class="image-name">{{ rightImage.fileName }}</div>
      </div>
    </div>

    <!-- サムネイル部 -->
    <div class="thumbnail-container">
      <div ref="leftThumbnail" class="thumbnail left-thumbnail">
        <div
          v-for="(img, index) in imagesData"
          :key="'left-' + index"
          class="thumbnail-item"
          :class="{ active: index === leftIndex }"
          @click="selectLeftImage(index)"
        >
          <img :src="img.url" :alt="img.fileName" />
          <span class="thumb-name">{{ img.fileName }}</span>
        </div>
      </div>
      <div ref="rightThumbnail" class="thumbnail right-thumbnail">
        <div
          v-for="(img, index) in imagesData"
          :key="'right-' + index"
          class="thumbnail-item"
          :class="{ active: index === rightIndex }"
          @click="selectRightImage(index)"
        >
          <img :src="img.url" :alt="img.fileName" />
          <span class="thumb-name">{{ img.fileName }}</span>
        </div>
      </div>
    </div>

    <!-- お気に入り追加ボタン -->
    <div class="controls">
      <button @click="addLeftToFavorites" aria-label="左画像をお気に入りに追加">
        お気に入りに追加（左画像）
      </button>
      <button @click="addRightToFavorites" aria-label="右画像をお気に入りに追加">
        お気に入りに追加（右画像）
      </button>
    </div>

    <!-- お気に入りページへのナビゲーションボタン -->
    <div class="favorites-nav">
      <NuxtLink to="/favorites">
        <button class="favorites-button">お気に入りページへ</button>
      </NuxtLink>
    </div>

    <!-- お気に入り画像出力部 -->
    <div class="favorites">
      <h3>お気に入り画像</h3>
      <div class="favorites-gallery">
        <div
          v-for="(favImg, index) in favoritesStore.favoriteImages"
          :key="index"
          class="favorite-item"
          @click="removeFavorite(index)"
        >
          <img :src="favImg.url" :alt="favImg.fileName" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useFavoritesStore } from '@/stores/favorites'

const imageModules = import.meta.glob('~/assets/images/*.jpg', {
  eager: true,
  query: '?url',
  import: 'default'
})
const imagesData = Object.entries(imageModules)
  .sort((a, b) => a[0].localeCompare(b[0]))
  .map(([file, url]) => ({
    url,
    fileName: file.split('/').pop() || '不明なファイル'
  }))

// console.log("画像データ:", imagesData) // 不要な console.log を削除

const leftIndex = ref(0)
const rightIndex = ref(0)
const leftImage = computed(() => {
  return imagesData[leftIndex.value] || { url: '', fileName: '画像がありません' }
})
const rightImage = computed(() => {
  return imagesData[rightIndex.value] || { url: '', fileName: '画像がありません' }
})
const favoritesStore = useFavoritesStore()

const leftThumbnail = ref<HTMLElement | null>(null)
const rightThumbnail = ref<HTMLElement | null>(null)

onMounted(() => {
  const syncScroll = (target: string) => {
    const source = target === 'left' ? leftThumbnail : rightThumbnail
    const destination = target === 'left' ? rightThumbnail : leftThumbnail

    if (source.value && destination.value) {
      destination.value.scrollLeft = source.value.scrollLeft
    }
  }

  if (leftThumbnail.value) {
    leftThumbnail.value.addEventListener('scroll', () => syncScroll('left'))
  }
  if (rightThumbnail.value) {
    rightThumbnail.value.addEventListener('scroll', () => syncScroll('right'))
  }

  // localStorage からお気に入り画像を復元
  const storedFavorites = localStorage.getItem('favoriteImages')
  if (storedFavorites) {
    try {
      favoritesStore.favoriteImages = JSON.parse(storedFavorites)
    } catch (error) {
      console.error('localStorage からの復元に失敗しました:', error)
    }
  }
})

function selectLeftImage(index: number) {
  leftIndex.value = index
}
function selectRightImage(index: number) {
  rightIndex.value = index
}

function addLeftToFavorites() {
  addFavorite(leftImage.value)
}
function addRightToFavorites() {
  addFavorite(rightImage.value)
}

function addFavorite(image: { url: string; fileName: string }) {
  if (!image || !image.url || !image.fileName) {
    console.error('無効な画像データです:', image)
    return
  }

  // 重複チェック
  if (favoritesStore.favoriteImages.find((favImg) => favImg.url === image.url)) {
    alert('この画像は既にお気に入りに追加されています')
    return
  }

  favoritesStore.addFavorite(image)
}

function removeFavorite(index: number) {
  favoritesStore.removeFavorite(index)
}

watch(
  () => favoritesStore.favoriteImages,
  (newVal) => {
    console.log('favoriteImages が更新されました:', newVal)
    // localStorage に保存
    localStorage.setItem('favoriteImages', JSON.stringify(newVal))
  },
  { deep: true }
)
</script>

<style scoped>
/* 以下、既存のスタイル（省略可） */

.image-selector {
  max-width: 1200px;
  margin: 0 auto;
}

.monitor-container {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}
.monitor {
  flex: 1;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: visible;
  position: relative;
}
.image-wrapper {
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.monitor img {
  max-width: 100%;
  max-height: 100%;
}
.image-name {
  width: 100%;
  text-align: center;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px;
  box-sizing: border-box;
  font-weight: bold;
  overflow-wrap: break-word;
}

.thumbnail-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
}
.thumbnail {
  flex: 1;
  height: 180px;
  overflow-x: auto;
  border: 1px solid #ccc;
  display: flex;
  gap: 10px;
  padding: 5px;
}
.thumbnail-item {
  position: relative;
}
.thumbnail-item.active {
  background-color: #e0e0e0; /* 追加 */
}
.thumbnail-item img {
  display: block;
  height: 100%;
}
.thumb-name {
  display: block;
  text-align: center;
  margin-top: 5px;
  font-size: 14px;
  color: #333;
  background: rgba(255, 255, 255, 0.9);
  padding: 4px 6px;
  border-radius: 4px;
  overflow-wrap: break-word;
}

.controls,
.favorites-nav {
  text-align: center;
  margin-bottom: 20px;
}
.favorites-button {
  background-color: #007bff;
  border: none;
  color: white;
  padding: 8px 16px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 4px;
}

.favorites {
  border-top: 1px solid #ccc;
  padding-top: 20px;
}
.favorites-gallery {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.favorite-item {
  cursor: pointer;
}
.favorite-item img {
  width: 100px;
  border: 1px solid #ccc;
}
</style>