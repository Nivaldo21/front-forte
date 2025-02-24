<template>
    <div>
        <div class="overflow-auto p-3">
        <form @submit.prevent="submitTransaction">
            <div class="mb-4">
                <label for="cliente_id" class="block text-sm font-medium text-gray-700">Cliente</label>
                <select v-model="transaction.cliente_id" id="cliente_id" class="p-2 border rounded w-full" 
                :class="{'border-red-500': $v.cliente_id.$error}" >
                    <option value="">Seleccione una opción</option>
                    <option v-for="cliente in clientes" :key="cliente.cliente_id" :value="cliente.cliente_id">{{ cliente.nombre }}</option>
                </select>
                <span v-if="$v.cliente_id.$error" class="text-red-500 text-sm">
                    {{ $v.cliente_id.$errors[0].$message }}
                </span>
            </div>
            <div class="mb-4">
                <label for="categoria" class="block text-sm font-medium text-gray-700">Categoría</label>
                <select v-model="transaction.categoria" id="categoria" class="p-2 border rounded w-full"
                :class="{'border-red-500': $v.categoria.$error}" >
                    <option value="">Seleccione una opción</option>
                    <option v-for="categorie in categories" :key="categorie._id" :value="categorie._id">{{ categorie.nombre }}</option>
                </select>
                <span v-if="$v.categoria.$error" class="text-red-500 text-sm">
                    {{ $v.categoria.$errors[0].$message }}
                </span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="mb-4">
                    <label for="cantidad" class="block text-sm font-medium text-gray-700">Cantidad</label>
                    <input v-model="transaction.cantidad" id="cantidad"
                    :class="{'border-red-500': $v.cantidad.$error}"
                    class="p-2 border rounded w-full" />
                    <span v-if="$v.cantidad.$error" class="text-red-500 text-sm">
                        {{ $v.cantidad.$errors[0].$message }}
                    </span>
                </div>
                <div class="mb-4">
                    <label for="tipo" class="block text-sm font-medium text-gray-700">Tipo</label>
                    <select v-model="transaction.tipo" id="tipo" class="p-2 border rounded w-full"
                    :class="{'border-red-500': $v.tipo.$error}" >
                        <option value="income">Ingreso</option>
                        <option value="expense">Gasto</option>
                    </select>
                    <span v-if="$v.tipo.$error" class="text-red-500 text-sm">
                        {{ $v.tipo.$errors[0].$message }}
                    </span>
                </div>
            </div>
            
            <div class="mb-4">
                <label for="fecha" class="block text-sm font-medium text-gray-700">Fecha</label>
                <input v-model="transaction.fecha" id="fecha" type="datetime-local" class="p-2 border rounded w-full" :min="'2025-01-01T00:00'"  :max="'2025-12-31T23:59'" 
                :class="{'border-red-500': $v.fecha.$error}"  />
                <span v-if="$v.fecha.$error" class="text-red-500 text-sm">
                    {{ $v.fecha.$errors[0].$message }}
                </span>
            </div>
            <div class="mt-5">
                <button type="submit" class="w-full p-2 bg-blue-600 text-white rounded-lg transition-all duration-300 ease-in-out hover:p-3 hover:bg-blue-700 hover:font-semibold">
                    <v-icon name="bi-send-plus-fill" class="mr-2" />
                    {{ edit ? 'Editar' : 'Agregar' }} Transacción
                </button>
            </div>
        </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import type Transaccion from '../models/Transaccion';
import type Cliente from '../models/Client';
import type Category from '../models/Category';
import { useVuelidate } from '@vuelidate/core'
import { helpers, required, numeric, minValue } from "@vuelidate/validators";

    const props = defineProps({
        edit: {
            type: Boolean,
            required: true
        },
        clientes: {
            type: Array as () => Cliente[],
            required: true
        },
        categories: {
            type: Array as () => Category[],
            required: true
        },
        editTransaction: {
            type: Object as () => Transaccion
        }
    });

    const rules = computed(() => ({
        cliente_id: {
            required: helpers.withMessage('Seleccione un Cliente.', required)
        },
        cantidad: {
            required: helpers.withMessage('Cantidad es obligatoria.', required),
            numeric: helpers.withMessage('El campo debe ser un número.', numeric),
            minValue: helpers.withMessage('Debe ser mayor a 0.', (value: number) => value > 0)
        },
        categoria: {
            required: helpers.withMessage('Escriba una categoria.', required)
        },
        tipo: {
            required: helpers.withMessage('Seleccione un Tipo de Ingreso.', required)
        },
        fecha: {
            required: helpers.withMessage('La Fecha es obligatoria.', required)
        }
    }));
    const transaction = reactive<Transaccion>({
        _id: undefined,
        cliente_id: null,
        cantidad: 0,
        categoria: '',
        tipo: 'income',
        fecha: '',
        estado: true,
        transaccion_id: undefined
    });
    const $v = useVuelidate(rules, transaction);
    $v.value.$reset();

    const clientes = ref(props.clientes);
    watch(() => props.clientes, (newClientes) => {
        clientes.value = newClientes;
    });

    const categories = ref(props.categories);
    watch(() => props.categories, (newCategories) => {
        categories.value = newCategories;
    });

    const emit = defineEmits(['submit-form','submit-form-edit']);

    onMounted(() => {
        $v.value.$reset();
        if (props.edit && props.editTransaction) {
            transaction._id = props.editTransaction._id;
            transaction.cliente_id = props.editTransaction.cliente_id;
            transaction.cantidad = props.editTransaction.cantidad;
            transaction.categoria = props.editTransaction.categoria;
            transaction.tipo = props.editTransaction.tipo;
            transaction.fecha = new Date(props.editTransaction.fecha).toISOString().slice(0, 16);
            transaction.estado = props.editTransaction.estado;
            transaction.transaccion_id = props.editTransaction.transaccion_id;
        }
    });

    const submitTransaction = async () => {
        const isValid = await $v.value.$validate();
        if (!isValid) return;
        emit('submit-form', transaction);
    }
</script>

<style scoped>

</style>