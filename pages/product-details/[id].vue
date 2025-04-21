<template>
  <div v-if="plainProduct">
    <!-- ページヘッダー：右上に「戻る」ボタン -->
    <div class="page-header">
      <button class="back-button" @click="goBack">戻る</button>
    </div>

    <!-- お気に入りギャラリー：ページ上部に配置 -->
    <div class="favorites-gallery">
      <h3>お気に入り画像一覧</h3>
      <div v-if="favoritesStore.favoriteImages.length === 0">
        お気に入り画像はありません
      </div>
      <div v-else class="favorites-list">
        <div
          v-for="(favImg, index) in favoritesStore.favoriteImages"
          :key="index"
          class="favorite-item"
        >
          <img :src="favImg.url" alt="Favorite Image" />
          <div class="fav-image-name">{{ favImg.fileName }}</div>
          <!-- プリント種類選択のドロップダウン -->
          <select v-model="favImg.selectedType">
            <option disabled value="">プリント種類を選択</option>
            <option value="四つ切">四つ切</option>
            <option value="六つ切">六つ切</option>
            <option value="キャビネ">キャビネ</option>
            <option value="手札">手札</option>
          </select>
          <!-- 数量入力 -->
          <input
            type="number"
            v-model.number="favImg.quantity"
            min="0"
            placeholder="枚数"
          />

            <!-- 削除ボタン -->
            <button @click="removeFavorite(index)" 
            class="delete-button">削除</button>

          <!-- 各お気に入り画像の受注明細（簡易表示） -->
          <div
            v-if="favImg.selectedType && favImg.quantity && favImg.quantity > 0"
            class="order-details"
          >
            <p>
              注文内容: <span>{{ favImg.selectedType }}</span> ×
              <span>{{ favImg.quantity }}</span> 枚
            </p>
            <p>
              金額:
              <span>{{ calculatePrice(favImg.selectedType, favImg.quantity) }}</span>
              円
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 商品詳細エリア：３カラムレイアウト -->
    <div class="product-page">
      <!-- 左カラム：商品画像 -->
      <div class="left-column">
        <img :src="plainProduct.src" alt="商品画像" />
      </div>

      <!-- 中央カラム：商品情報 -->
      <div class="center-column">
        <h1 class="product-title">{{ plainProduct.productName }}</h1>
        <p v-for="(line, idx) in plainProduct.description.split('\n')" :key="idx" class="desc-line">
    {{ line }}
  </p>
        <p class="product-price">{{ plainProduct.price }}</p>
      </div>

      <!-- 右カラム：受注明細と合計金額、受注フォーム -->
      <div class="right-column">
        <h2>受注明細</h2>
        <div class="order-summary">
          <div v-if="orderItems.length === 0">
            注文されている項目はありません。
          </div>
          <div v-else>
            <table>
              <thead>
                <tr>
                  <th>画像名</th>
                  <th>プリント種</th>
                  <th>数量</th>
                  <th>金額</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in orderItems" :key="idx">
                  <td>{{ item.fileName }}</td>
                  <td>{{ item.selectedType }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>{{ calculatePrice(item.selectedType, item.quantity) }} 円</td>
                </tr>
              </tbody>
            </table>
            <div class="total">
              合計金額: {{ totalPrice }} 円
            </div>
            <div class="total-with-tax">
              消費税込合計金額: {{ totalPriceWithTax }} 円
           </div>
          </div>
        </div>
        <div class="order-form">
          <h3>受注フォーム</h3>
          <form @submit.prevent="submitOrder">
            <div>
              <label for="customerName">お名前:</label>
              <input type="text" id="customerName" v-model="customerName" required />
            </div>
            <div>
              <label for="address">メールアドレス:</label>
              <input type="text" id="address" v-model="address" required />
            </div>
            <div>
              <label for="comment">備考（撮影日等）:</label>
              <textarea id="comment" v-model="comment"></textarea>
            </div>
            <button type="submit">注文を確定する</button>
          </form>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="not-found">
    商品が見つかりません
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, ref, onMounted, watch } from 'vue'
import { useFavoritesStore } from '@/stores/favorites'
import { serializeJson, deserializeJson } from '@/utils/jsonUtils'

// Pinia ストアの取得
const favoritesStore = useFavoritesStore()

// ルートパラメータから商品ID取得
const route = useRoute()
const productId = Number(route.params.id)
const removeFavorite = (index: number) => {
  favoritesStore.favoriteImages.splice(index, 1)
}

// 消費税率
const TAX_RATE = 0.10

// 消費税込みの合計金額を計算したcomputedプロパティ
const totalPriceWithTax = computed(() => {
  return Math.round(totalPrice.value * (1 + TAX_RATE))
})

// 商品データの定義
const products = [
  {
    id: 1,
    src: '/option-images/print/printo_nomi.jpg',
    productName: 'プリント',
    description: `サイズ\n四切りプリント 254㎜×305㎜\n六切りプリント 205㎜×254㎜\nキャビネプリント 180㎜×127㎜\n手札プリント 127㎜×89㎜\n\n料金\n四切りプリント 5800 円（6380 円 税込）\n六切りプリント 4800 円（5280 円 税込）\nキャビネプリント 3800 円（4180 円 税込）\n手札プリント 3500 円（3850 円 税込）`,
    // description: `サイズ\n四切りプリント 254㎜×305㎜\n六切りプリント 205㎜×254㎜\nキャビネプリント 180㎜×127㎜\n手札プリント 127㎜×89㎜\n\n料金\n四切りプリント 5800 円（6380 円 税込）\n六切りプリント 4800 円（5280 円 税込）\nキャビネプリント 3800 円（4180 円 税込）\n手札プリント 3500 円（3850 円 税込）`,
    price: ''
  },
  {
    id: 2,
    src: '/option-images/print/6tsugiri_3.jpg',
    productName: '六切りプリント（大きめサイズ）',
    description: `この高品質な六切りプリントは、\n美しい仕上がりと豊かな色彩が魅力です。`,
    price: '4,800 円（5,280 円 税込）'
  }
];




//  
const plainProduct = computed(() => {
  const found = products.find(p => p.id === productId)
  return found ? { ...found } : null
})

// 各プリントタイプの単価設定
const prices: Record<string, number> = {
  "四つ切": 5800,
  "六つ切": 4800,
  "キャビネ": 3800,
  "手札": 3500
}

// 数量と単価で金額計算
const calculatePrice = (type: string, qty: number): number => {
  return prices[type] ? prices[type] * qty : 0
}

// localStorage からお気に入り画像の復元
onMounted(() => {
  const storedFavorites = localStorage.getItem('favoriteImages')
  if (storedFavorites) {
    try {
      favoritesStore.favoriteImages = deserializeJson(storedFavorites)
    } catch (error) {
      console.error('localStorage からの復元に失敗しました:', error)
    }
  }
})

// favoritesStore の変更を localStorage に保存
watch(
  () => favoritesStore.favoriteImages,
  (newVal) => {
    console.log('favoriteImages が更新されました:', newVal)
    localStorage.setItem('favoriteImages', serializeJson(newVal))
  },
  { deep: true }
)

// 受注明細用の注文項目の抽出
const orderItems = computed(() => {
  return favoritesStore.favoriteImages.filter((item: any) => {
    return item.selectedType && item.quantity > 0
  })
})

// 全注文項目の合計金額計算
const totalPrice = computed(() => {
  return orderItems.value.reduce((sum: number, item: any) => {
    return sum + calculatePrice(item.selectedType, item.quantity)
  }, 0)
})

// 受注フォーム用のデータ
const customerName = ref('')
const address = ref('')
const comment = ref('')

// 注文確定処理
const submitOrder = () => {
  const orderDetails = {
    customerName: customerName.value,
    address: address.value,
    comment: comment.value,
    items: orderItems.value,
    total: totalPrice.value,
  }
  console.log("注文内容:", orderDetails)
  alert("注文が確定されました！")
  // 必要に応じてフォームリセットやサーバ送信処理を追加します
}

// 戻るボタンの処理（Vue Router を使用）
const router = useRouter()
const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
/* ページヘッダー */
.page-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 20px;
}
.back-button {
  background-color: blue;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}
.back-button:hover {
  background-color: darkblue;
}

/* お気に入りギャラリーのスタイル */
.favorites-gallery {
  padding: 20px;
  margin-bottom: 30px;
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.favorites-gallery h3 {
  margin-bottom: 10px;
}
.favorites-list {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
}
.favorite-item {
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
  text-align: center;
}
.favorite-item img {
  width: 100%;
  border: 1px solid #ccc;
  display: block;
}
.fav-image-name {
  font-size: 14px;
  margin-top: 5px;
}
.favorite-item select {
  display: block;
  margin: 10px auto 5px;
  padding: 4px;
  width: 80%;
}
.favorite-item input[type="number"] {
  display: block;
  margin: 5px auto 10px;
  padding: 4px;
  width: 60%;
}
.order-details {
  background-color: #f7f7f7;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

/* 商品詳細エリア：３カラムレイアウト */
.product-page {
  display: flex;
  gap: 20px;
  padding: 20px;
}
.left-column {
  flex: 1;
  max-width: 30%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.left-column img {
  max-width: 100%;
  height: auto;
  border: 1px solid #ccc;
}
.center-column {
  flex: 1;
  max-width: 40%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.product-title {
  font-size: 2rem;
  margin-bottom: 10px;
}
.product-description {
  font-size: 1.2rem;
  margin-bottom: 15px;
}
.product-price {
  font-weight: bold;
  font-size: 1.5rem;
}

/* 右カラム：受注明細と受注フォーム */
.right-column {
  flex: 1;
  max-width: 30%;
  border-left: 1px solid #eee;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.right-column h2 {
  margin-bottom: 10px;
}
.order-summary table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 10px;
}
.order-summary table th,
.order-summary table td {
  border: 1px solid #ddd;
  padding: 6px;
  text-align: center;
}
.total {
  text-align: right;
  font-weight: bold;
  margin-bottom: 20px;
}
.order-form form > div {
  margin-bottom: 10px;
}
.order-form label {
  display: block;
  margin-bottom: 5px;
}
.order-form input,
.order-form textarea {
  width: 100%;
  padding: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.order-form button {
  background-color: #f0c14b;
  border: 1px solid #a88734;
  padding: 8px 12px;
  cursor: pointer;
}
.order-form button:hover {
  background-color: #e2b33b;
}

/* 商品が見つからない場合 */
.not-found {
  padding: 20px;
  text-align: center;
  font-size: 1.5rem;
}
/* 商品説明 */
.desc-line {
  line-height: 0.9; /* 好みの行の高さに調整してください */
  margin: 0 0 8px;  /* 行間を離したい場合の余白調整 */
}
/* 消費税 */
.total-with-tax {
  font-weight: bold;
  margin-top: 10px;
  color: #d35400; /* オレンジ系など強調色に */
}
</style>