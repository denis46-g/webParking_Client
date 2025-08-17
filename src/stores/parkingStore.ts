import { defineStore } from 'pinia';

export const useParkingStore = defineStore('parkingStore', {
  state: () => ({
    parkingSpace: null as null | { id: number; location: string}
  }),
  actions: {
    chooseParkingSpace(id: number, location: string) {
        if(this.parkingSpace == null || this.parkingSpace.id !== id)
            this.parkingSpace = {id: id, location: location};
            
        else
            this.parkingSpace = null;
    },
    logout() {
        this.parkingSpace = null;
    }
  }
})