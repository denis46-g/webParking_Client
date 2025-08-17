<template>
  
  <div class="flex align-items-start justify-content-center min-h-screen surface-ground">
    <div class="surface-200 p-5 shadow-2" style="width: 1000px; height: 800px;">
      <div class="header-container">
        <Button
                icon="pi pi-arrow-left"
                class="arrow-button shadow-3"
                @click="goBack"
                text
                severity="secondary"
                style="width: 50px;"
        />
        <h2 class="header-title">Booking: {{ parkingStore.parkingSpace?.location }}</h2>
      </div>
      
      <div class="flex-row-container mt-5">
        <div class="field-group">
            <label for="time_from" class="mr-5">От</label>
            <DatePicker
                id="time_from"
                v-model="time_from_date"
                showTime
                dateFormat="yy-MM-dd"
                class="shadow-3"
                inputId="time_from_input"
                showIcon
            />
        </div>

        <div class="field-group ml-4">
            <label for="time_to" class="mr-5">До</label>
            <DatePicker
                id="time_to"
                v-model="time_to_date"
                showTime
                dateFormat="yy-MM-dd"
                class="shadow-3"
                inputId="time_to_input"
                showIcon
            />
        </div>
      </div>

      <br>
      
      <Button label="Book" class="mt-4 shadow-2" severity="primary" style="width: 180px;" @click="checkData" />

      <div class="mt-6 shadow-2">
        <h3>All bookings:</h3>
        <ul class="list">
          <li v-for="res in reservs" :key="res.id" class="mb-2">
            {{ res.timeFrom }} - {{ res.timeTo }}
          </li>
        </ul>
      </div>
      
    </div>
  </div>
</template>

<script setup lang="ts">
    import { ref, watch, onMounted } from 'vue';
    import axios from 'axios';
    import { useRouter } from 'vue-router';
    import { useUserStore } from '../stores/userStore';
    import { useParkingStore } from '../stores/parkingStore';
    import DatePicker from 'primevue/datepicker';
    import { Reservation } from '../views/ParkingSpacesView.vue';

    const router = useRouter();
    const userStore = useUserStore();
    const parkingStore = useParkingStore();

    const reservs = ref<Reservation[]>();

    const goBack = () => {
        router.push('/main');
    };

    const time_from_date = ref<Date | null>(null);
    const time_to_date = ref<Date | null>(null);

    const time_from = ref('');
    const time_to = ref('');

    watch(time_from_date, (val) => {
        time_from.value = val ? val.toISOString() : '';
    });

    watch(time_to_date, (val) => {
        time_to.value = val ? val.toISOString() : '';
    });

    const checkData = async () => {
        try {
            const psId = parkingStore.parkingSpace?.id
            const uId = userStore.user?.id
            const response = await axios.post('http://localhost:8080/addReservation', {
                parkingSpaceId: psId,
                timeFrom: time_from.value,
                timeTo: time_to.value,
                userId: uId
            });

            if (response.data.success) {
                parkingStore.logout();
                router.push('/main');
            } else {
                alert("Парковочное место не забронировано");


                /*toast.add({
                    severity: 'error',
                    summary: 'Ошибка',
                    detail: 'Введены некорректные данные',
                    life: 3000
                });*/
            }
        } catch (error: any) {
            alert("Ошибка добавления бронирования");
        }
    };

    onMounted(async () => {
        try {
            const id = parkingStore.parkingSpace?.id
            const response = await axios.get(`http://localhost:8080/parking_spaces/${id}/reservs`);
            if (response.data){
                reservs.value = response.data;
                console.log(reservs.value.length);
            }
        } catch (error: any) {
            console.error(`Ошибка загрузки бронирований места ${parkingStore.parkingSpace?.location}`, error.message);
        }
    });
</script>

<style scoped>
    .header-container {
        display: flex;
        align-items: center;
        gap: 22rem;
    }

    .arrow-button {
        color: black;
        font-size: 1.2rem;
    }

    .flex-row-container {
        display: flex;
        align-items: center;
        gap: 20rem;
    }

    .field-group label {
        white-space: nowrap;
    }

   .mt-6 {
        width: 280px;
        margin: 0 auto;
   }
</style>