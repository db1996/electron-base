<script setup lang="ts">
import { appConfig } from '@main/types/appConfig'
import Button from '@renderer/components/ui/button/Button.vue'
import { useOptionsStore } from '@renderer/composables/useOptionsStore'
import SetupLayout from '@renderer/layout/SetupLayout.vue'
import router from '@renderer/router/router'
import { onMounted, ref, watch } from 'vue'

const optionsStore = useOptionsStore()

const isLoading = ref(false)
const loadingMessage = ref('Initializing setup...')

watch(
    () => optionsStore.setupStatus.completed,
    completed => {
        if (completed) {
            router.push('/')
        }
    },
    { immediate: true }
)

onMounted(async () => {
    if (optionsStore.setupStatus.completed) {
        router.push('/')
    }
})

async function nextStep () {
    optionsStore.setupStatus.step += 1

    console.log(
        'Advancing to setup step:',
        optionsStore.setupStatus.step,
        '/',
        appConfig.MAX_SETUP_STEPS
    )

    if (optionsStore.setupStatus.step > appConfig.MAX_SETUP_STEPS) {
        optionsStore.setupStatus.completed = true
    }

    await optionsStore.updateSetupStatus()
}
</script>

<template>
    <SetupLayout :loading="isLoading" :loadingMessage="loadingMessage">
        <div class="flex justify-center items-center gap-2">
            <h2 class="text-2xlg font-semibold">Welcome to the Setup Page</h2>
            <h2 class="text-1xl font-semibold">
                {{ optionsStore.setupStatus.step }} / {{ appConfig.MAX_SETUP_STEPS }}
            </h2>

            <div class="grow text-right absolute right-8">
                <Button @click="nextStep">{{
                    optionsStore.setupStatus.step < appConfig.MAX_SETUP_STEPS
                        ? 'Next Step'
                        : 'Finish'
                }}</Button>
            </div>
        </div>

        <div class="flex justify-center items-center">
            <!-- Use CardForm -->
        </div>
    </SetupLayout>
</template>
