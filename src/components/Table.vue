<template>
    <div class="relative overflow-x-auto sm:rounded-lg my-5">
        <div @click="toggleFilters" class="flex justify-start items-center font-bold text-blue-700 gap-2 hover:cursor-pointer mb-3 w-fit">
            <span class="text-xl">Filters</span>
            <v-icon name="io-options" scale="1.5" />
        </div>
        <transition name="fade">
            <div v-show="tooltip" class="felx justify-around filters mb-4 flex gap-4 border-1 border-gray-200 p-4 rounded-lg">
                <select v-model="selectedTipo" @change="applyFilters">
                    <option value="">Todos los Tipos</option>
                    <option value="income">Ingreso</option>
                    <option value="expense">Gasto</option>
                </select>
                <select v-model="selectedCliente" @change="applyFilters">
                    <option value="">Todos los Clientes</option>
                    <option v-for="cliente in clientes" :key="cliente.cliente_id" :value="cliente.cliente_id">
                    {{ cliente.nombre }}
                    </option>
                </select>
                <select v-model="selectedCategoria" @change="applyFilters">
                    <option value="">Todas las Categorías</option>
                    <option v-for="categoria in categorias" :key="categoria._id" :value="categoria._id">
                    {{ categoria.nombre }}
                    </option>
                </select>
                <select v-model="selectedEstatus" @change="applyFilters">
                    <option value="">Todos los Estatus</option>
                    <option :value="true">Activo</option>
                    <option :value="false">Inactivo</option>
                </select>
                <div class="flex gap-2">
                    <span class="text-blue-500">Inicio</span>
                    <input type="date" v-model="selectedFechaInicio" @change="applyFilters" />
                    -
                    <span class="text-blue-500">Fin</span>
                    <input type="date" v-model="selectedFechaFin" @change="applyFilters" />
                </div>
            </div>
        </transition>
        <table class="w-full text-sm text-center rtl:text-right text-gray-700">
            <thead class="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                    <th scope="col" class="px-6 py-3">
                        Cliente
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Tipo
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Cantidad
                    </th>
                    <th scope="col" class="w-md px-6 py-3">
                        Categoria
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Fecha
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Estatus
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Acciones
                    </th>
                </tr>
            </thead>
            <transition-group name="list" tag="tbody">
                <tr v-for="record in data" :key="record.transaccion_id" class="bg-white hover:bg-gray-50">
                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {{ getClientName(String(record.cliente_id)) }}
                    </th>
                    <td class="px-6 py-4">
                        <span v-if="record.tipo=== 'income'" class="bg-green-100 text-green-800 text-xs font-medium me-2 px-3 py-1 rounded-sm">Ingreso</span>
                        <span v-else class="bg-red-100 text-red-800 text-xs font-medium me-2 px-3 py-1 rounded-sm">Gasto</span>
                    </td>
                    <td class="px-6 py-4 text-dark font-medium">
                        {{ formattedDetail(record.cantidad) }}
                    </td>
                    <td class="px-6 py-4 text-bold text-blue-500">
                        <span class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-3 py-1 rounded-sm">{{ getCategoryName(record.categoria) }}</span>
                    </td>
                    <td class="px-6 py-4 text-bold text-dark">
                        {{ new Date(record.fecha).toLocaleString('es-ES', { timeZone: 'UTC' })}}
                    </td>
                    <td class="px-6 py-4">
                        <label class="inline-flex items-center me-5 cursor-pointer">
                            <span class="ms-3 text-sm font-medium text-gray-900 mr-3">Inactiva</span>
                            <input type="checkbox" value="" class="sr-only peer" :checked="record.estado" @change="handleStatusChange(record.transaccion_id!, ($event.target as HTMLInputElement).checked)">
                            <div class="relative w-11 h-6 bg-red-400 rounded-full
                                peer-checked:bg-green-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full 
                                peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] 
                                after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all">
                            </div>
                            <span class="ms-3 text-sm font-medium text-gray-900">Activa</span>
                        </label>
                    </td>
                    <td class="px-6 py-4 text-right flex gap-2">
                        <button @click="handleEdit(record)" size="sm" class="bg-blue-400 px-3.5 py-1.5 text-white rounded-full hover:cursor-pointer transition duration-300 transform hover:-translate-y-1">
                            <v-icon name="md-edit-outlined" scale="1" fill="white" />
                        </button>
                        <div id="tooltip-edit" role="tooltip" class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700">
                            Editar
                            <div class="tooltip-arrow" data-popper-arrow></div>
                        </div>
                        <button @click="handleDelete(record)" class="bg-red-400 px-3.5 py-1.5 text-white rounded-full hover:cursor-pointer transition duration-300 transform hover:-translate-y-1">
                            <v-icon name="hi-trash" scale="1" fill="white" />
                        </button>
                    </td>
                </tr>
            </transition-group>
        </table>
    </div>
</template>

<script setup lang="ts">
    import type Transaccion from '../models/Transaccion';
    import type Cliente from '../models/Client';
    import {ref, watch, defineEmits } from 'vue';
    import type Category from '../models/Category';

    const props = defineProps({
        data: {
            type: Array as () => Transaccion[],
            required: true
        },
        clientes: {
            type: Array as () => Cliente[],
            required: true
        },
        categories: {
            type: Array as () => Category[],
            required: true
        }
    });

    const selectedTipo = ref('');
    const selectedCliente = ref('');
    const selectedCategoria = ref('');
    const selectedEstatus = ref('');
    const selectedFechaInicio = ref('');
    const selectedFechaFin = ref('');

    const tooltip = ref(false);
    const toggleFilters = () => {
        tooltip.value = !tooltip.value;
    };

    const applyFilters = () => {
        const filters: any = {
            tipo: selectedTipo.value,
            cliente: selectedCliente.value,
            categoria: selectedCategoria.value,
            estado: selectedEstatus.value
        };

        if (selectedFechaInicio.value) {
            filters.fechaInicio = new Date(selectedFechaInicio.value).toISOString();
        }

        if (selectedFechaFin.value) {
            filters.fechaFin = new Date(selectedFechaFin.value).toISOString();
        }

        emit('filter-transactions', filters);
    };
    const clientes = ref(props.clientes);
    const categorias = ref(props.categories);
    const emit = defineEmits(['update-status','delete-transaction','edit-transaction','filter-transactions']);
    
    // Método para obtener el nombre del cliente basado en cliente_id
    const getClientName = (cliente_id: string) => {
        const client = clientes.value.find((client: Cliente) => client.cliente_id === cliente_id);
        return client ? client.nombre : 'Desconocido';
    };
    const getCategoryName = (_id: String) => {
        const category = categorias.value.find((category: Category) => category._id === _id);
        return category ? category.nombre : 'Desconocido';
    };

    // Método para manejar el cambio de estado y emitir un evento
    const handleStatusChange = (transaccion_id: number, newStatus: boolean) => {
        emit('update-status', { transaccion_id, newStatus });
    };
    // Método para manejar la eliminación de una transacción
    const handleDelete = (record: Transaccion) => {
        emit('delete-transaction', record.transaccion_id);
    };
    // Método para editar una transacción
    const handleEdit = (transaccion: Transaccion) => {
        emit('edit-transaction', transaccion);
    };
    // Watch para actualizar las transacciones cuando cambien
    watch(() => props.clientes, (newClientes) => {
        clientes.value = newClientes;
    });
    // Watch para actualizar los clientes cuando cambien
    watch(() => props.categories, (newCategories) => {
        categorias.value = newCategories;
    });
    const formattedDetail = (number: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(number));
    };
</script>

<style scoped>
.list-enter-active, .list-leave-active {
  transition: opacity 0.5s;
}
.list-enter-from, .list-leave-to {
  opacity: 0;
}
.fade-leave-active{
    transition: opacity 0.4s;
}
.fade-enter-active {
  transition: opacity 0.9s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>