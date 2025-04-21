// src/stores/favorites.ts
import { defineStore } from 'pinia';

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    favoriteImages: [] as Array<{ url: string; fileName: string }>
  }),
  actions: {
    addFavorite(newFavorite: { url: string; fileName: string }) {
      console.log('addFavorite が呼び出されました:', newFavorite);
      this.favoriteImages.push(newFavorite)
    },
    removeFavorite(index: number) {
      console.log(`removeFavorite が呼び出されました: index=${index}`);
      this.favoriteImages.splice(index, 1)
    },
    setFavoriteImages(images: Array<{ url: string; fileName: string }>) {
      this.favoriteImages = images;
    }
  }
});