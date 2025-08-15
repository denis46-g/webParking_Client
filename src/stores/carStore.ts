import { defineStore } from 'pinia';
import axios from 'axios';

export const useCarStore = defineStore('carStore', {
  state: () => ({
    cars: [] as { id: number; brand: string; licensePlate: string }[]
  }),
  actions: {
    /*async fetchCars() {
        try{
            const id = useUserStore().user?.id
            const response = await axios.get(`http://localhost:8080/users/${id}/cars`)
            this.cars = response.data
        } catch(error){
            console.error('Ошибка при обновлении списка машин после удаления машины:', error)
        }

    },*/
    removeCar(id: number) {
      this.cars = this.cars.filter(car => car.id !== id)
    }
  }
})