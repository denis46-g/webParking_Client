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

    <div class="left-panel">
        <Button
            label="Add Car"
            class="shadow-3"
            severity="success"
            style="width: 100%; height: 50px;"
            @click="addCar"
        />

        <div class="car-list-container">
            <h3>Car List</h3>
            <ul class="car-list">
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
    
    <!-- Левая часть -->
    <div class="side-grid">
      <div
        v-for="n in 12"
        :key="'A' + n"
        class="square"
        :class="{
            'occupied': parkingSpacesMap['A' + n],
            'available': parkingSpacesMap['A' + n] === false
        }"
      >
        A{{ n }}
      </div>
    </div>

    <!-- Правая часть -->
    <div class="side-grid">
      <div
        v-for="n in 12"
        :key="'B' + n"
        class="square"
        :class="{
            'occupied': parkingSpacesMap['B' + n],
            'available': parkingSpacesMap['B' + n] === false
        }"
      >
        B{{ n }}
      </div>
    </div>
  </div>

  <!--<footer class="footer">
      <div class="footer-buttons">
        <Button label="Book" disabled class="shadow-3" style="width:150px; height: 50px;"/>
        <Button label="Cancel reservation" disabled class="shadow-3" style="width:150px; height: 50px;" />
      </div>
  </footer>-->
</template>

<script lang="ts" setup>
    import { useRouter } from 'vue-router';
    import axios from 'axios';
    import { ref, onMounted } from 'vue';
    import { useUserStore } from '../stores/userStore';
    import { useCarStore } from '../stores/carStore';

    type ParkingSpace = {
        id: number,
        location: string,
        isOccupied: boolean
    }
    const parkingSpacesMap = ref<Record<string, boolean>>({})

    const userStore = useUserStore();
    const carStore = useCarStore(); 
    const router = useRouter();

    type Car = {
        id: number;
        brand: string;
        licensePlate: string;
    };
    const cars = ref<Car[]>(carStore.cars);

    const logout = () => {
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

    onMounted(async () => {
        try {
            const response = await axios.get('http://localhost:8080/parking_spaces');

            if (response.data) {
                const data: ParkingSpace[] = response.data;
                
                parkingSpacesMap.value = Object.fromEntries(
                    data.map(space => [space.location, space.isOccupied])
                );

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
  gap: 12rem;
}

.left-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 250px;
  padding: 1rem;
}

.car-list-container {
  margin-top: 1rem;
}

.car-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.car-list li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #ccc;
}

/* Красная иконка */
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

.occupied {
  background-color: #c32727ff; /* светло-красный */
}

.available {
  background-color: #0fb80fff; /* светло-зелёный */
}

/*.footer {
  padding: 1rem;
  background-color: #f8f9fa;
  text-align: center;
  margin-top: 30px;
}

.footer-buttons {
    display: inline-flex;
    gap: 3rem;
}*/

</style>