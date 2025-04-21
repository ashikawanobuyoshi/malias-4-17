<template>
    <div class="product-details">
      <h1>商品明細</h1>
      <div v-if="product">
        <img :src="product.src" alt="商品画像" />
      </div>
      <div v-else>
        商品が見つかりません
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRoute } from 'vue-router'
  import { computed } from 'vue'
  
  // ルートパラメータを取得する
  const route = useRoute()
  
  // 取得したパラメータを数値に変換
  const productId = Number(route.params.id)
  
  // 商品データの例（すべてリテラル形式で定義しているプレーンオブジェクト）
  const products = [
    {
      id: 1,
      src: '/option-images/print/4tsugiri_3.jpg',
      description: '四切りプリント。高品質な写真印刷です。',
      price: '5,800円（6,380円 税込）',
    },
    {
      id: 2,
      src: '/option-images/print/6tsugiri_3.jpg',
      description: '六切りプリント（大きいサイズ）。額付も選べます。',
      price: '7,800円（8,580円 税込）',
    }
    // 必要に応じて他の商品を追加
  ]
  
  // 指定された ID に一致する商品を計算プロパティで取得
  const product = computed(() => {
    return products.find((p) => p.id === productId) || null // IDが一致しない場合は null
  })
  </script>
  
  <style scoped>
  .product-details {
    text-align: center;
    padding: 16px;
  }
  
  .product-details img {
    max-width: 100%;
    height: auto;
  }
  </style>