<template>
  
  <div class="flex align-items-start justify-content-center min-h-screen surface-ground">
    <div class="surface-200 p-5 shadow-2" style="width: 500px;">
      <div class="header-container">
        <Button
                icon="pi pi-arrow-left"
                class="arrow-button shadow-3"
                @click="goBack"
                text
                severity="secondary"
                style="width: 50px;"
        />
        <h2 class="header-title">Adding a car</h2>
      </div>
      
      <label for="brand" class="mr-6">Марка машины</label>
      <InputText id="brand" v-model="brand" class="mb-3 shadow-3" />

      <br>

      <label for="licensePlate" class="mr-6">Номерной знак</label>
      <InputText id="licensePlate" v-model="licensePlate" class="mb-3 shadow-3" />

      <br>
      
      <Button label="Add" class="mt-4 shadow-2" severity="primary" style="width: 280px;" @click="checkData" />
      
    </div>
  </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import axios from 'axios';
    import { useRouter } from 'vue-router';
    import { useUserStore } from '../stores/userStore';

    const router = useRouter();
    const userStore = useUserStore();

    const goBack = () => {
        router.push('/main');
    };

    const brand = ref('')
    const licensePlate = ref('')

    const checkData = async () => {
        try {
            const id = userStore.user?.id
            const response = await axios.post('http://localhost:8080/addCar', {
                brand: brand.value,
                licensePlate: licensePlate.value,
                ownerId: id
            });

            if (response.data.success) {
                router.push('/main');
            } else {
                alert("Машина не добавлена");


                /*toast.add({
                    severity: 'error',
                    summary: 'Ошибка',
                    detail: 'Введены некорректные данные',
                    life: 3000
                });*/
            }
        } catch (error: any) {
            alert("Ошибка добавления машины");
        }
    };
</script>

<style scoped>
    .header-container {
        display: flex;
        align-items: center;
        gap: 6.5rem;
    }

    .arrow-button {
        color: black;
        font-size: 1.2rem;
    }
</style>