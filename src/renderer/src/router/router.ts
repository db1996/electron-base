import { createRouter, RouteRecordRaw, createWebHashHistory } from 'vue-router'
import HomePage from '@renderer/pages/HomePage.vue'
import SettingsPage from '@renderer/pages/SettingsPage.vue'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'entry',
        redirect: 'home'
    },
    {
        path: '/home',
        name: 'home',
        component: HomePage
    },
    {
        path: '/settings',
        name: 'settings',
        component: SettingsPage
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    linkActiveClass: 'border-indigo-500',
    linkExactActiveClass: 'border-indigo-700'
})

export default router
