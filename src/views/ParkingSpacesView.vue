<template>
    <header class="header">
      <div></div>
      <h1 class="title">Доммашин</h1>
      <Button
        label="Logout"
        class="logout-button shadow-3"
        @click="logout"
        severity="danger"
        style="width: 100px; height: 50px;"
      />
    </header>
  <div class="page-container">

    <div class="panel">
        <Button
            label="Add Car"
            class="shadow-3"
            severity="success"
            style="width: 100%; height: 50px;"
            @click="addCar"
        />

        <div class="list-container">
            <h3>Car List</h3>
            <ul class="list">
                <li v-for="car in cars" :key="car.id">
                    <Button
                      @click="deleteCar(car.id)"
                      aria-label="Delete"
                      class="p-button-text p-button-rounded p-button-icon-only delete-btn"
                    >
                      <i class="pi pi-trash trash-icon" />
                    </Button>
                    {{ car.brand }} ({{ car.licensePlate }})
                </li>
            </ul>
        </div>
    </div>
    
    <div class="side-grid">
      <div
        v-for="n in 12"
        :key="'A' + n"
        class="square"
        :class="{
            'chosen': parkingSpacesChosen['A' + n]
        }"
        @click="chooseParkingSpace('A' + n)"
      >
        A{{ n }}
      </div>
    </div>

    <div class="side-grid">
      <div
        v-for="n in 12"
        :key="'B' + n"
        class="square"
        :class="{
            'chosen': parkingSpacesChosen['B' + n]
        }"
        @click="chooseParkingSpace('B' + n)"
      >
        B{{ n }}
      </div>
    </div>

    <div class="panel">
        <Button
            label="Book"
            class="shadow-3"
            :class="{
              'booking-active': isAnyParkingSpaceChosen
            }"
            style="width: 100%; height: 50px;"
            :disabled="!isAnyParkingSpaceChosen"
            @click="bookParkingSpace"
        />

        <div class="list-container">
            <h3>Reservation List</h3>
            <ul class="list">
                <li v-for="res in reservs" :key="res.id">
                    <Button
                      @click="deleteReservation(res.id)"
                      aria-label="Delete"
                      class="p-button-text p-button-rounded p-button-icon-only delete-btn"
                    >
                      <i class="pi pi-trash trash-icon" />
                    </Button>
                    {{parkingSpacesLocations[res.parkingSpaceId]}} {{res.timeFrom}} - {{res.timeTo}}
                </li>
            </ul>
        </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
    import { useRouter } from 'vue-router';
    import axios from 'axios';
    import { ref, onMounted, reactive, computed } from 'vue';
    import { useUserStore } from '../stores/userStore';
    import { useCarStore } from '../stores/carStore';
    import { useReservStore } from '../stores/reservStore';
    import { useParkingStore } from '../stores/parkingStore';

    const userStore = useUserStore();
    const carStore = useCarStore();
    const reservStore = useReservStore();
    const parkingStore = useParkingStore();
    const router = useRouter();

    type ParkingSpace = {
        id: number,
        location: string,
        isOccupied: boolean
    }
    const parkingSpacesLocations = ref<Record<number, string>>({})
    const parkingSpacesKeys = ref<Record<string, number>>({})
    const parkingSpacesChosen = reactive<Record<string, boolean>>({})

    type Car = {
        id: number;
        brand: string;
        licensePlate: string;
    };
    const cars = ref<Car[]>(carStore.cars);

    type Reservation = {
        id: number;
        parkingSpaceId: number;
        timeFrom: string;
        timeTo: string;
        userId: number;
    };
    const reservs = ref<Reservation[]>(reservStore.reservs);

    const logout = () => {
        parkingStore.logout();
        userStore.logout();
        router.push('/login');
    };

    const addCar = () => {
        router.push('/addCar');
    }

    const deleteCar = async (id: number) => {
      try {
            await axios.delete(`http://localhost:8080/cars/${id}`)
            carStore.removeCar(id)
            try{
              const id = userStore.user?.id
              const response = await axios.get(`http://localhost:8080/users/${id}/cars`)
              cars.value = response.data;
            } catch(error){
              console.error('Ошибка при обновлении списка машин после удаления машины:', error)
            }
        } catch (error) {
            console.error('Ошибка при удалении машины:', error)
      }
    }

    const chooseParkingSpace = (location: string) => {
      parkingSpacesChosen[location] = !parkingSpacesChosen[location];
      
      for (const key in parkingSpacesChosen) {
        if (key !== location && parkingSpacesChosen[key] === true) {
          parkingSpacesChosen[key] = false;
        }
      }

      parkingStore.chooseParkingSpace(parkingSpacesKeys.value[location], location);
    }

    const isAnyParkingSpaceChosen = computed(() => {
      return Object.values(parkingSpacesChosen).some(value => value === true);
    });

    const bookParkingSpace = () => {
      router.push('/bookParkingSpace');
    }

    const deleteReservation = async (id: number) => {
      try {
            await axios.delete(`http://localhost:8080/reservations/${id}`)
            reservStore.removeReservation(id)
            try{
              const id = userStore.user?.id
              const response = await axios.get(`http://localhost:8080/users/${id}/reservs`)
              reservs.value = response.data;
            } catch(error){
              console.error('Ошибка при обновлении списка бронирований после удаления бронирования:', error)
            }
        } catch (error) {
            console.error('Ошибка при удалении бронирования:', error)
      }
    }

    onMounted(async () => {
        try {
            const response = await axios.get('http://localhost:8080/parking_spaces');

            if (response.data) {
                const data: ParkingSpace[] = response.data;

                parkingSpacesLocations.value = Object.fromEntries(
                    data.map(space => [space.id, space.location])
                );

                parkingSpacesKeys.value = Object.fromEntries(
                    data.map(space => [space.location, space.id])
                );
                
                if(parkingStore.parkingSpace == null){
                  Object.assign(parkingSpacesChosen, Object.fromEntries(
                    data.map(space => [space.location, false])
                  ));
                }
                else{
                  Object.assign(parkingSpacesChosen, Object.fromEntries(
                    data.map(space => [space.location, space.id == parkingStore.parkingSpace.id])
                  ));
                }

            } else {
                alert("Ошибка");

                /*toast.add({
                    severity: 'error',
                    summary: 'Ошибка',
                    detail: 'Неверный логин и/или пароль',
                    life: 3000
                });*/
            }
        } catch (error: any) {
            console.error("Ошибка", error.message);
        }

        try {
            const id = userStore.user?.id
            const response = await axios.get(`http://localhost:8080/users/${id}/cars`);
            if (response.data){
                cars.value = response.data;
            }
        } catch (error: any) {
            console.error("Ошибка загрузки машин", error.message);
        }

        try {
            const id = userStore.user?.id
            const response = await axios.get(`http://localhost:8080/users/${id}/reservs`);
            if (response.data){
                reservs.value = response.data;
            }
        } catch (error: any) {
            console.error("Ошибка загрузки бронирований", error.message);
        }
    });
</script>

<style scoped>

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background-color: #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  border-bottom: 1px solid #ccc;
  z-index: 10;
}

.page-container {
  display: flex;
  justify-content: space-between;
  gap: 6rem;
}

.panel {
  display: flex;
  flex-direction: column;
  min-width: 230px;
  padding: 1rem 0rem 1rem 0rem;
}

.list-container {
  margin-top: 1rem;
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #ccc;
}

.trash-icon {
  color: red;
}

.side-grid {
  display: grid;
  grid-template-columns: repeat(3, 70px); /* 3 блока в ряд */
  grid-template-rows: repeat(4, 70px);    /* 4 ряда */
  gap: 20px;
}

.square {
  width: 70px;
  height: 70px;
  background-color: #cfcfcf;
  border: 1px solid #999;
  box-sizing: border-box;

  display: flex;               
  align-items: center;         
  justify-content: center;
  font-weight: bold;
  font-size: 1rem;
  color: #333;
}

.chosen {
  background-color: #333;
  border: 1px solid #999;
  color: #ffffff;
}

.booking-active, .booking-active:hover {
  background-color: #333 !important;
  border: 1px solid #999 !important;
  color: #ffffff !important;
}

</style>