import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import NotFound from '../views/NotFound.vue';
import Transactions from '../views/Transactions.vue';

const routes:Array<{ path: string, component: any, name?: string }> = [
  { path: '/', component: Dashboard },
  { path: '/Transactions', component: Transactions },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
