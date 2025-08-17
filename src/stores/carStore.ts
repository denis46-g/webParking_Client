import { defineStore } from 'pinia';

export const useCarStore = defineStore('carStore', {
  state: () => ({
    cars: [] as { id: number; brand: string; licensePlate: string }[]
  }),
  actions: {
    removeCar(id: number) {
      this.cars = this.cars.filter(car => car.id !== id)
    }
  }
})