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
        <h2 class="header-title">Registration</h2>
      </div>
      
      <label for="fullName" class="mr-6">Имя</label>
      <InputText id="fullName" v-model="fullName" class="mb-3 shadow-3" style="margin-left:95px;" />

      <br>

      <label for="phoneNumber" class="mr-6">Номер телефона</label>
      <InputText id="phoneNumber" v-model="phoneNumber" class="mb-3 shadow-3" />

      <br>

      <label for="email" class="mr-6">Email</label>
      <InputText id="email" v-model="email" class="mb-3 shadow-3" style="margin-left:85px;" />

      <br>

      <label for="password" class="mr-6">Пароль</label>
      <Password id="password" v-model="password" class="mb-3 shadow-3" style="margin-left:65px;" />

      <br>

      <label for="password" class="mr-6">Повторите пароль</label>
      <Password id="repeatPassword" v-model="repeatPassword" class="shadow-3" style="margin-right:15px;" />

      <br>
      
      <Button label="Create an account" class="mt-4 shadow-2" severity="primary" style="width: 280px;" @click="checkData" />
      
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
        router.push('/login');
    };

    const fullName = ref('')
    const phoneNumber = ref('')
    const email = ref('')
    const password = ref('')
    const repeatPassword = ref('')

    const checkData = async () => {
        try {
            const response = await axios.post('http://localhost:8080/register', {
                fullName: fullName.value,
                phoneNumber: phoneNumber.value,
                email: email.value,
                password: password.value,
                repeatPassword: repeatPassword.value
            });

            if (response.data) {
                userStore.login(response.data);
                router.push('/main');
            } else {
                alert(responce.data.message);

                /*toast.add({
                    severity: 'error',
                    summary: 'Ошибка',
                    detail: 'Введены некорректные данные',
                    life: 3000
                });*/
            }
        } catch (error: any) {
            alert("Ошибка регистрации");
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