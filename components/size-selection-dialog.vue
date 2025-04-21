<template>
  <div class="size-selection-dialog">
    <h3>プリントの種類と枚数を選択してください</h3>
    <ul>
      <li v-for="size in sizes" :key="size.name">
        <label>
          <input
            type="checkbox"
            v-model="selectedSizes"
            :value="size.name"
          />
          {{ size.label }} ({{ size.price }}円)
        </label>
        <input
          type="number"
          v-model="counts[size.name]"
          min="0"
          @change="updateTotal"
        />
      </li>
    </ul>
    <p>合計金額: {{ total }}円</p>
    <button @click="confirmSelection">決定</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const sizes = [
  { name: '4tsugiri_print', label: '四切りプリントのみ', price: 6380 },
  { name: '4tsugiri_daishi', label: '四切り紙台紙付プリント', price: 8580 },
  { name: '4tsugiri_gaku', label: '四切り額付プリント', price: 9405 },
  { name: '6tsugiri_print', label: '六切りプリントのみ', price: 5280 },
  { name: '6tsugiri_daishi', label: '六切り紙台紙付プリント', price: 7194 },
  { name: '6tsugiri_gaku', label: '六切り額付プリント', price: 6820 },
  { name: 'cabine_print', label: 'キャビネプリントのみ', price: 4180 },
  { name: 'cabine_daishi', label: 'キャビネ紙台紙付プリント', price: 5214 },
  { name: 'cabine_gaku', label: 'キャビネ額付プリント', price: 5555 },
  { name: 'tegata_print', label: '手札プリントのみ', price: 3850 },
  { name: 'tegata_daishi', label: '手札紙台紙付プリント', price: 4653 },
];

const selectedSizes = ref<string[]>([]);
const counts = ref<{ [key: string]: number }>({});

// counts の初期化
sizes.forEach((size) => {
  counts.value[size.name] = 0;
});

const total = ref(0);

const updateTotal = () => {
  total.value = 0;
  sizes.forEach((size) => {
    if (counts.value[size.name] > 0) {
      total.value += size.price * counts.value[size.name];
    }
  });
};

const emit = defineEmits(['size-selected', 'close']);

const confirmSelection = () => {
  emit('size-selected', {
    sizes: selectedSizes.value,
    counts: counts.value,
    total: total.value,
  });
  emit('close');
};
</script>

<style scoped>
.size-selection-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border: 1px solid #ccc;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.size-selection-dialog h3 {
  margin-bottom: 10px;
}

.size-selection-dialog ul {
  list-style: none;
  padding: 0;
}

.size-selection-dialog li {
  padding: 8px 12px;
  border: 1px solid #ddd;
  margin-bottom: 5px;
  cursor: pointer;
}

.size-selection-dialog li.selected {
  background-color: #f0c14b;
}

.size-selection-dialog button {
  background-color: #f0c14b;
  border: 1px solid #a88734;
  padding: 8px 12px;
  cursor: pointer;
}

.size-selection-dialog button:hover {
  background-color: #e2b33b;
}
</style>