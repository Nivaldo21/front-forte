<template>
  <div class="container mx-auto p-4 mt-25">
    <div class="mt-5 bg-white p-6 rounded-lg shadow-md">
      <div class="flex justify-between align-center ">
        <h1 class="text-2xl font-semibold flex items-center">
          <div class="mr-2 bg-blue-100 p-2 rounded-full flex items-center"> 
            <v-icon name="io-receipt" scale="1.2" fill="blue" />
          </div>
          Lista de Transacciones
        </h1>
        <button @click="newTransaction" class="bg-green-400 px-6 py-2 text-white rounded-full hover:cursor-pointer transition duration-300 transform hover:-translate-y-1">
          <v-icon class="mr-1" name="md-addcircleoutline-twotone" scale="1" fill="white" />
          Nueva transaccion
        </button>
      </div>
      <Table :data="transactions" :categories="categories" :clientes="clientes" 
            @filter-transactions="handleFilterTransactions" 
            @edit-transaction="editTransaction" @update-status="updateTransactionStatus" @delete-transaction="deleteTransactionModal" />
    </div>

    <!-- Modal -->
    <transition name="modal">
      <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-gray-100/80 mt-20">
        <div class="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold">{{ edit ? 'Editar' : 'Crear'}} Transacción</h2>
            <button @click="closeModal" class="text-black-500 hover:cursor-pointer">
              <v-icon name="io-close-circle-sharp" scale="2" fill="red" />
            </button>
          </div>
          <FormTransaccion :edit="edit" :editTransaction="edit_transaction" :categories="categories" :clientes="clientes" @submit-form="submitTransaction" />
        </div>
      </div>
    </transition>

    <transition name="modal">
      <div v-if="isModalConfirmOpen" class="fixed inset-0 flex items-center justify-center bg-gray-100/80 mt-20">
        <div class="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
          <div class="flex flex-col gap-3 items-center text-center mb-4">
            <div class="mr-2 bg-red-100 p-4 rounded-full flex items-center"> 
              <v-icon name="hi-solid-receipt-refund" scale="2" fill="red" />
            </div>
            <h2 class="text-2xl font-semibold">¿Seguro que quieres eliminar la Transacción?</h2>
          </div>
          <div class="flex justify-center gap-5 mt-5">
            <button @click="deleteTransaction(modalTransactionId!)" class="hover:cursor-pointer px-4 py-2 bg-red-500 text-white rounded-full">Si, eliminar</button>
            <button @click="closeModalConfirm" class="hover:cursor-pointer px-4 py-2 bg-gray-500 text-white rounded-full">No, cancelar</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import type Transaccion from '../models/Transaccion';
  import type Client from '../models/Client';
  import Table from '../components/Table.vue';
  import { useToast } from "vue-toastification";
  import FormTransaccion from '../components/FormTransaccion.vue';
  import type Category from '../models/Category';

  import { getTransactions, addTransaction, updateTransaction, _deleteTransaction } from '../api/transactions';
  import { getClients } from '../api/clients';
  import { getCategories } from '../api/categories';

    const transactions = ref<Transaccion[]>([]);
    const clientes = ref<Client[]>([]);
    const categories = ref<Category[]>([]);
    const toast = useToast();
    const edit = ref(false);
    let edit_transaction = ref<Transaccion>();
    const isModalOpen = ref(false);
    const isModalConfirmOpen = ref(false);
    const modalTransactionId = ref<number | null>(null);

    const openModalConfirm = () => {
      isModalConfirmOpen.value = true;
    };
    const closeModalConfirm = () => {
      isModalConfirmOpen.value = false;
      modalTransactionId.value = null;
    };

    const openModal = () => {
      isModalOpen.value = true;
    };
    const closeModal = () => {
      isModalOpen.value = false;
    };

    const fetchClients = async () => {
      try {
          const response = await getClients();
          clientes.value = response.data;
      } catch (error) {
          console.error('Error al obtener las clientes:', error);
      }
    };

    const handleFilterTransactions = (filters: { tipo: string, cliente: string, categoria: string, estado: boolean, fechaInicio: string, fechaFin: string }) => {
      fetchTransactions(filters);
    };

    const fetchCategories = async () => {
      try {
          const response = await getCategories();
          categories.value = response.data;
      } catch (error) {
          console.error('Error al obtener las categorias:', error);
      }
    };

    const fetchTransactions = async (filters = {}) => {
      try {
          const response = await await getTransactions(filters);
          transactions.value = response.data;
      } catch (error) {
          console.error('Error al obtener las transacciones:', error);
      }
    };

    const updateTransactionStatus = async ({ transaccion_id, newStatus }: { transaccion_id: number, newStatus: boolean }) => {
      try {
          const transaction = transactions.value.find(t => t.transaccion_id === transaccion_id);
          if (transaction) {
              transaction.estado = newStatus;
              toast.success("Estatus actualizado");
              await updateTransaction(transaction);
              console.warn('Transacción actualizada:', transaction);
          }
      } catch (error) {
          console.error('Error al actualizar el estado de la transacción:', error);
      }
    };

    const deleteTransactionModal = (transaccion_id: number) => {
      modalTransactionId.value = transaccion_id;
      openModalConfirm();
    };

    const deleteTransaction = async (transaccion_id: number) => {
      try{
        const transaction = transactions.value.find(t => t.transaccion_id === transaccion_id);
        if(transaction){
          if (transaction._id) {
            await _deleteTransaction(transaction._id);
          } else {
            toast.error('Transaction ID is undefined');
            return;
          }
          transactions.value = transactions.value.filter(t => t.transaccion_id !== transaccion_id);
          toast.success("Transacción eliminada con exito");
          closeModalConfirm();
        }
      } catch (error) {
          console.error('Error al eliminar la transacción:', error);
      }
    }; 

    const submitTransaction = async (newTransaction:Transaccion) => {
    try {
        // Se Ajusta la fecha para evitar la diferencia de horas
        const localDate = new Date(newTransaction.fecha);
        const adjustedDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
        newTransaction.fecha = adjustedDate.toISOString();
        if (edit.value) { //Editar transaccion
            const response = await updateTransaction(newTransaction);
            const index = transactions.value.findIndex(t => t._id === newTransaction._id);
            transactions.value[index] = response.data;
            toast.success("Transacción actualizada con exito");
        }else{ //Crear transaccion
          const response = await addTransaction(newTransaction);
          transactions.value.push(response.data);
          toast.success("Transacción creada con exito");
        }
        closeModal();
    } catch (error) {
        console.error('Hubo un error con la transacción:', error);
    }
    };

    const editTransaction = (transaction: Transaccion) => {
      edit.value = true;
      edit_transaction.value = transaction;
      openModal();
    };

    const newTransaction = () => {
      edit.value = false;
      openModal();
    };

    onMounted(() => {
        fetchTransactions();
        fetchClients();
        fetchCategories();
    });
</script>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.modal-enter-to, .modal-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>