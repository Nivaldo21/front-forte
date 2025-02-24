<template>
    <div>
    <nav class="bg-white fixed w-full z-20 top-0 start-0 border-b border-gray-200">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <RouterLink to="/" class="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="https://img.freepik.com/premium-vector/money-refund-icon_192037-2307.jpg" class="h-12" alt="Logo">
            <span class="self-center text-2xl font-semibold whitespace-nowrap">Transactions App</span>
        </RouterLink>
        <div class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <button data-collapse-toggle="navbar-sticky" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-around text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200" aria-controls="navbar-sticky" aria-expanded="false">
              <span class="sr-only">Open main menu</span>
              <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
              </svg>
          </button>
        </div>
        <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
          <ul class="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white">
            <li>
              <RouterLink to="/" class="flex items-center block py-3 px-5 bg-blue-700 text-white bg-blue-700 rounded-full border-1 transition duration-300 transform hover:-translate-y-1" >
                <v-icon class="mr-2" name="md-spacedashboard-outlined" scale="1" fill="white" />
                Dashboard
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/transactions" class="flex items-center block py-3 px-5 bg-blue-700 text-white bg-blue-700 rounded-full border-1 transition duration-300 transform hover:-translate-y-1" >
                <v-icon class="mr-2" name="si-moneygram" scale="1" fill="white" />
                Transacciones
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
</style>