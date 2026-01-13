<script setup lang="ts">
import CardForm from '@renderer/components/form/CardForm.vue'
import { useOptionsStore } from '@renderer/composables/useOptionsStore'
import SetupLayout from '@renderer/layout/SetupLayout.vue'
import router from '@renderer/router/router'
import { onMounted, ref, watch } from 'vue'

const optionsStore = useOptionsStore()

const isLoading = ref(false)
const loadingMessage = ref('Initializing setup...')

watch(
    () => optionsStore.tutorialStatus,
    newStatus => {
        if (newStatus.completed) {
            router.push('/')
        }
    },
    { immediate: true }
)

onMounted(() => {
    if (optionsStore.tutorialStatus.completed) {
        router.push('/')
    }
})
</script>

<template>
    <SetupLayout :loading="isLoading" :loadingMessage="loadingMessage">
        <div class="flex justify-center items-center gap-2">
            <h2 class="text-2xl font-semibold">Welcome to the Setup Page</h2>
            <h2 class="text-1xl font-semibold">{{ optionsStore.tutorialStatus.step }} / 4</h2>
        </div>

        <div class="flex justify-center items-center">
            <CardForm class="w-[80%]" title="Form card" description="You can change this later">
            </CardForm>
        </div>
    </SetupLayout>
</template>
