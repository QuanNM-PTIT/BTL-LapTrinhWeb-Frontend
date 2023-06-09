import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BookView from '../views/BookView.vue'
import BookListView from '../views/BookListView.vue'
import CartView from '../views/CartView.vue'
import EditBook from '../components/EditBook.vue'
import OrderView from '../views/OrderView.vue'
import AllOrderView from '../views/AllOrderView.vue'

const router = createRouter(
    {
        history: createWebHistory(import.meta.env.BASE_URL),
        routes: [
            {
                path: '/',
                name: 'home',
                component: HomeView
            },
            {
                path: '/book/:id',
                name: 'book',
                component: BookView
            },
            {
                path: '/all-book',
                name: 'all',
                component: BookListView
            },
            {
                path: '/edit-book/:id',
                name: 'add',
                component: EditBook
            },
            {
                path: '/cart',
                name: 'cart',
                component: CartView
            },
            {
                path: '/order/:id',
                name: 'order_id',
                component: OrderView
            },
            {
                path: '/order',
                name: 'order',
                component: OrderView
            },
            {
                path: '/order_history',
                name: 'order_history',
                component: AllOrderView
            },
        ]
    })

export default router
