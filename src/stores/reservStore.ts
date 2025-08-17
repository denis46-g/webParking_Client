import { defineStore } from 'pinia';

export const useReservStore = defineStore('reservStore', {
  state: () => ({
    reservs: [] as { id: number; parkingSpaceId: number; timeFrom: string, timeTo: string, userId: number }[]
  }),
  actions: {
    removeReservation(id: number) {
      this.reservs = this.reservs.filter(res => res.id !== id)
    }
  }
})