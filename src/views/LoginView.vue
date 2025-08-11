<template>
  <div class="flex align-items-start justify-content-center min-h-screen surface-ground">
    <div class="surface-200 p-5 shadow-2" style="width: 500px;">
      <h2>Login</h2>
      
      <label for="email" class="mr-6">Email</label>
      <InputText id="email" v-model="email" class="mb-3 shadow-3" />

      <br>

      <label for="password" class="mr-5">Пароль</label>
      <Password id="password" v-model="password" class="shadow-3" />

      <br>
      
      <Button label="Enter" class="mt-4 shadow-2" severity="primary" style="width: 280px;" @click="checkData" />

      <br>
      
      <Button label="Register" class="mt-4 shadow-2" severity="primary" style="width: 280px;" @click="goToRegister" />
      
    </div>
  </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import axios from 'axios';
    import { useRouter } from 'vue-router';
    import { useUserStore } from '../stores/userStore';
    //import { useToast } from 'primevue/usetoast';

    const router = useRouter();
    const userStore = useUserStore();
    //const toast = useToast();

    const email = ref('');
    const password = ref('');

    const checkData = async () => {
        try {
            const response = await axios.post('http://localhost:8080/auth/login', {
                email: email.value,
                password: password.value
            });

            if (response.data) {
                userStore.login(response.data);
                router.push('/main');
            } else {
                alert("Неверное имя пользователя и/или пароль");

                /*toast.add({
                    severity: 'error',
                    summary: 'Ошибка',
                    detail: 'Неверный логин и/или пароль',
                    life: 3000
                });*/
            }
        } catch (error: any) {
            alert("Ошибка авторизации");
        }
    };

    const goToRegister = () => {
        router.push('/register');
    };
</script>