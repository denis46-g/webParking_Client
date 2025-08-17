import { createRouter, createWebHashHistory } from 'vue-router';

import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ParkingSpacesView from '../views/ParkingSpacesView.vue'
import AddCarView from '../views/AddCarView.vue'
import BookParkingSpaceView from '../views/BookParkingSpaceView.vue'

const routes = [
    { path: '/', redirect: '/login' },
    {
        path: '/login',
        component: LoginView,
        name: 'login'
    },
    {
        path: '/register',
        component: RegisterView,
        name: 'register'
    },
    {
        path: '/main',
        component: ParkingSpacesView,
        name: 'main'
    },
    {
        path: '/addCar',
        component: AddCarView,
        name: 'addCar'
    },
    {
        path: '/bookParkingSpace',
        component: BookParkingSpaceView,
        name: 'bookParkingSpace'
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;