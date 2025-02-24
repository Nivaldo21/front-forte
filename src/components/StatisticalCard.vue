<template>
    <div class="basis-1/4 bg-white p-4 rounded-lg shadow-lg">
        <div class="flex justify-between items-center mb-5">
            <h2 class="text-xl font-bold">{{ title }}</h2>
            <div :class="`rounded-full ${colorDetail} p-2`">
                <v-icon :name="icon" scale="1.5" :fill="colorIcon" />
            </div>
        </div>
        <p :class="`text-3xl text-semibold ${colorText}`">
            {{ formattedDetail }}
        </p>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';

    const props = defineProps({
        title: { type: String, required: true },
        type: { type: String, default: 'string' },
        detail: { type: [String, Number], required: true },
        icon: { type: String, required: false , default: '' },
        colorDetail: { type: String, default: ' ' },
        colorText: { type: String, default: 'text-blue-400' },
        colorIcon: { type: String, default: 'blue' }
    });

    const formattedDetail = computed(() => {
        if (props.type === 'money') {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(props.detail));
        }
        return props.detail;
    });
</script>

<style scoped>

</style>