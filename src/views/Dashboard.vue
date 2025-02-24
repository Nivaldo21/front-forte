<template>
    <div class="mt-25">
        <div class="flex flex-row gap-10 mx-auto max-w-screen-xl">
            <StatisticalCard title="Ingresos Totales" :detail="sumIncomeTransaction" type="money" icon="md-attachmoney" color-icon="green" color-text="text-green-700" color-detail="bg-green-100" />
            <StatisticalCard title="Gastos Totales" :detail="sumExpenseTransaction" type="money" icon="md-moneyoff" color-icon="red" color-text="text-red-400" color-detail="bg-red-100" />
            <StatisticalCard title="Balance Actual" :detail="sumIncomeTransaction-sumExpenseTransaction" type="money" icon="md-balance-twotone" color-icon="blue" color-text="text-blue-400" color-detail="bg-blue-100"/>
            <StatisticalCard title="Clientes" :detail="clients.length" icon="ri-user-2-fill" color-icon="blue" color-text="text-blue-400" color-detail="bg-blue-100" />
        </div>
        <div class="mt-8 mx-auto max-w-screen-xl">
            <div class="bg-white p-4 rounded-lg shadow-lg h-1/2">
                <div class="flex justify-between items-baseline flex-wrap">
                    <h2 class="text-xl flex items-center font-bold mb-4">
                        <div class="rounded-full bg-blue-100 p-2 mr-2">
                            <v-icon name="md-calendarmonth-outlined" scale="1.5" fill="blue" />
                        </div>
                        Ingresos y Gastos Mensuales
                    </h2>
                    <select 
                        v-model="selectedMonth" 
                        id="monthSelect" 
                        class="mt-1 p-2 border rounded w-1/4">
                        <!-- Opción para todo el año (valor null) -->
                        <option :value="null">Todo el año</option>
                        <!-- Opciones para cada mes -->
                        <option v-for="(mes, index) in monthLabels" 
                                :key="index" 
                                :value="index">
                        {{ mes }}
                        </option>
                    </select>
                </div>
                <Bar :data="computedChartData" :options="chartOptions" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
                <div class="bg-white p-4 rounded-lg shadow-lg">
                    <h2 class="text-xl flex items-center font-bold mb-4">
                        <div class="rounded-full bg-blue-100 p-2 mr-2">
                            <v-icon name="ri-user-2-fill" scale="1.5" fill="blue" />
                        </div>
                        Ingresos y Gastos por Clientes
                    </h2>
                    <div class="mb-4">
                        <select 
                            v-model="selectedClientId" 
                            id="cliente" 
                            class="mt-1 p-2 border rounded w-full">
                            <option value="">Seleccione un cliente</option>
                            <option v-for="client in clients" :key="client.cliente_id" :value="client.cliente_id">
                                {{ client.nombre }}
                            </option>
                        </select>
                    </div>
                    <Doughnut :data="doughnutDataSelectedClient" :options="doughnutOptions" />
                </div>
                <div class="bg-white p-4 rounded-lg shadow-lg">
                    <h2 class="text-xl flex items-center font-bold mb-4">
                        <div class="rounded-full bg-blue-100 p-2 mr-2">
                            <v-icon name="md-category-outlined" scale="1.5" fill="blue" />
                        </div>
                        Ingresos y Gastos por Categoria
                    </h2>
                    <div class="mb-4">
                        <select 
                            v-model="selectedCategoryId" 
                            id="cliente" 
                            class="mt-1 p-2 border rounded w-full">
                            <option value="">Seleccione una Categoria</option>
                            <option v-for="categpry in categories" :key="categpry._id" :value="categpry._id">
                                {{ categpry.nombre }}
                            </option>
                        </select>
                    </div>
                    <Doughnut :data="doughnutDataSelectedCategory" :options="doughnutOptions" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import StatisticalCard from '../components/StatisticalCard.vue';
    import { onMounted } from 'vue';
    import { Bar, Doughnut} from 'vue-chartjs'
    import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'
    ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)
    import { ref, computed } from 'vue';
    import type Transaccion from '../models/Transaccion';
    import type Cliente from '../models/Client';
    import type Category from '../models/Category';

    import { getTransactions } from '../api/transactions';
    import { getClients } from '../api/clients';
    import { getCategories } from '../api/categories';

    const income_transactions = ref<Transaccion[]>([]);
    const expense_transactions = ref<Transaccion[]>([]);
    const clients = ref<Cliente[]>([]);
    const selectedClientId = ref<String>('');
    const categories = ref<Category[]>([]);
    const selectedCategoryId = ref<String>('');
    const monthLabels = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const selectedMonth = ref<null | number>(null);

    const chartData = ref<{ labels: string[], datasets: { label: string, data: number[], backgroundColor: string, borderColor: string, borderWidth: number }[] }>({
        labels: [],
        datasets: []
    });
    const doughnutDataSelectedClient = computed(() => {
        return {
            labels: ['Ingresos', 'Gastos'],
            datasets: [
            {
                label: 'Cantidad',
                data: [clientIncome.value, clientExpense.value],
                backgroundColor: ['rgba(75,192,192,0.6)', 'rgba(255,99,132,0.6)'],
                borderColor: ['rgb(75,192,192)', 'rgb(255,99,132)'],
                borderWidth: 1,
            },
            ],
        };
    });
    const doughnutDataSelectedCategory = computed(() => {
        return {
            labels: ['Ingresos', 'Gastos'],
            datasets: [
            {
                label: 'Cantidad',
                data: [categoryIncome.value, categoryExpense.value],
                backgroundColor: ['rgba(75,192,192,0.6)', 'rgba(255,99,132,0.6)'],
                borderColor: ['rgb(75,192,192)', 'rgb(255,99,132)'],
                borderWidth: 1,
            },
            ],
        };
    });

    const computedChartData = computed(() => {
    if (selectedMonth.value !== null) {
        // Agrupar por día para el mes seleccionado
        const currentYear = new Date().getFullYear();
        const month = selectedMonth.value;
        const daysInMonth = new Date(currentYear, month + 1, 0).getDate();
        const dailyIncomes = new Array(daysInMonth).fill(0);
        const dailyExpenses = new Array(daysInMonth).fill(0);

        income_transactions.value.forEach((transaction: any) => {
        const date = new Date(transaction.fecha);
        if (date.getMonth() === month && date.getFullYear() === currentYear) {
            const day = date.getDate();
            dailyIncomes[day - 1] += transaction.cantidad;
        }
        });
        expense_transactions.value.forEach((transaction: any) => {
        const date = new Date(transaction.fecha);
        if (date.getMonth() === month && date.getFullYear() === currentYear) {
            const day = date.getDate();
            dailyExpenses[day - 1] += transaction.cantidad;
        }
        });

        const dayLabels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);
        return {
            labels: dayLabels,
            datasets: [
                {
                label: 'Ingresos',
                data: dailyIncomes,
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgb(75,192,192)',
                borderWidth: 1,
                },
                {
                label: 'Gastos',
                data: dailyExpenses,
                backgroundColor: 'rgba(255,99,132,0.2)',
                borderColor: 'rgb(255,99,132)',
                borderWidth: 1,
                },
            ],
        };
    } else {
        // Agrupar por mes para todo el año
        const monthlyIncomes = new Array(12).fill(0);
        const monthlyExpenses = new Array(12).fill(0);

        income_transactions.value.forEach((transaction: any) => {
        const date = new Date(transaction.fecha);
        const month = date.getMonth();
        monthlyIncomes[month] += transaction.cantidad;
        });
        expense_transactions.value.forEach((transaction: any) => {
        const date = new Date(transaction.fecha);
        const month = date.getMonth();
        monthlyExpenses[month] += transaction.cantidad;
        });

        return {
        labels: monthLabels,
        datasets: [
            {
            label: 'Ingresos',
            data: monthlyIncomes,
            backgroundColor: 'rgba(75,192,192,0.2)',
            borderColor: 'rgb(75,192,192)',
            borderWidth: 1,
            },
            {
            label: 'Gastos',
            data: monthlyExpenses,
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgb(255,99,132)',
            borderWidth: 1,
            },
        ],
        };
    }
    });

    const chartOptions = computed(() => ({
        responsive: true,
        scales: {
            x: {
            title: {
                display: true,
                text: selectedMonth.value === null ? 'Meses' : 'Días'
            }
            },
            y: {
            title: {
                display: true,
                text: 'Cantidad'
            }
            }
        }
    }));

    const doughnutOptions = ref({
        responsive: true
    });
    const sumIncomeTransaction = computed(() => {
        return income_transactions.value.reduce((acc, transaction) => acc + transaction.cantidad, 0);
    });

    const sumExpenseTransaction = computed(() => {
        return expense_transactions.value.reduce((acc, transaction) => acc + transaction.cantidad, 0);
    });

    const fetchTransactions = async () => {
        try {
            const expense_response = await getTransactions({ tipo: 'expense', estado: true });
            expense_transactions.value = expense_response.data;
            const icnome_response = await getTransactions({ tipo: 'income', estado: true });
            income_transactions.value = icnome_response.data;
        } catch (error) {
            console.error('Error al obtener las transacciones:', error);
        }
    };

    const fetchClients = async () => {
        try {
            const response = await getClients();
            clients.value = response.data;
        } catch (error) {
            console.error('Error al obtener las transacciones:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await getCategories();
            categories.value = response.data;
        } catch (error) {
            console.error('Error al obtener las categorias:', error);
        }
    };

    const clientIncome = computed(() => {
        if (!selectedClientId.value) return 0;
        return income_transactions.value.reduce((acc, trans) => {
            return trans.cliente_id === selectedClientId.value
            ? acc + trans.cantidad
            : acc;
        }, 0);
    });

    const clientExpense = computed(() => {
        if (!selectedClientId.value) return 0;
        return expense_transactions.value.reduce((acc, trans) => {
            return trans.cliente_id === selectedClientId.value
            ? acc + trans.cantidad 
            : acc;
        }, 0);
    });

    const categoryIncome = computed(() => {
        if (!selectedCategoryId.value) return 0;
        return income_transactions.value.reduce((acc, trans) => {
            return trans.categoria === selectedCategoryId.value
            ? acc + trans.cantidad
            : acc;
        }, 0);
    });

    const categoryExpense = computed(() => {
        if (!selectedCategoryId.value) return 0;
        return expense_transactions.value.reduce((acc, trans) => {
            return trans.categoria === selectedCategoryId.value
            ? acc + trans.cantidad 
            : acc;
        }, 0);
    });

   /*  const printPrincipalChart = async () => {
        const monthlyIncomes = new Array(12).fill(0);
        const monthlyExpenses = new Array(12).fill(0);
        
        income_transactions.value.forEach((transaction: any) => {
            const date = new Date(transaction.fecha);
            const month = date.getMonth();
            monthlyIncomes[month] += transaction.cantidad;
        });
        expense_transactions.value.forEach((transaction: any) => {
            const date = new Date(transaction.fecha);
            const month = date.getMonth();
            monthlyExpenses[month] += transaction.cantidad;
        });

        chartData.value = {
            labels: [
                "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
            ],  
            datasets: [ 
                {
                    label: 'Ingresos',
                    data: monthlyIncomes,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgb(75, 192, 192)',
                    borderWidth: 1,
                },
                {
                    label: 'Gastos',
                    data: monthlyExpenses,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgb(255, 99, 132)',
                    borderWidth: 1,
                },
            ],
        };
    }; */

    onMounted(async () => {
        await fetchTransactions();
        await fetchClients();
        await fetchCategories();
        chartData.value = computedChartData.value;
    });
    
</script>

<style scoped>

</style>