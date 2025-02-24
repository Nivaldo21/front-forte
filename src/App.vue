<script setup lang="ts">
import Navbar from './components/Navbar.vue';
</script>

<template>
  <div>
    <header>
      <Navbar />
    </header>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
</style>
