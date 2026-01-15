<script setup lang="ts">
import ConfirmDialog from '@components/ConfirmDialog.vue'
import { useAppearance } from '@renderer/composables/useAppearance'
import { useOptionsStore } from '@renderer/composables/useOptionsStore'
import ReleasenotesDialog from '@renderer/pages/dialogs/ReleasenotesDialog.vue'
import router from '@renderer/router/router'
import { BreadcrumbItem } from '@renderer/types/navigation'
import { onMounted, useSlots, watch } from 'vue'
import { Theme } from 'vue-sonner/src/packages/types.js'
import 'vue-sonner/style.css' // vue-sonner v2 requires this import
import AppHeaderLayout from './app/AppHeaderLayout.vue'
import Sonner from '@components/ui/sonner/Sonner.vue'

interface Props {
    breadcrumbs?: BreadcrumbItem[]
    loading?: boolean
    loadingMessage?: string
}

const optionsStore = useOptionsStore()

withDefaults(defineProps<Props>(), {
    breadcrumbs: () => [],
    loading: false,
    loadingMessage: ''
})

const appearanceStore = useAppearance()
const slots = useSlots()

watch(
    () => optionsStore.setupStatus.completed,
    completed => {
        if (completed) {
            router.push('/')
        }
    },
    { immediate: true, deep: true }
)

onMounted(async () => {
    await optionsStore.init()
})
</script>

<template>
    <AppHeaderLayout :breadcrumbs="breadcrumbs">
        <div
            class="flex h-full flex-1 flex-col gap-4 rounded-xl p-4"
            :class="{ loading: loading, 'overflow-hidden': loading }"
        >
            <div class="loading-div w-full h-full overflow-hidden" v-if="loading">
                <div class="loading-message" v-if="loadingMessage">{{ loadingMessage }}</div>
            </div>
            <div
                v-if="slots.header || slots.actions"
                class="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center"
                :class="{ 'sm:justify-between': slots.header, 'sm:justify-end': !slots.header }"
            >
                <slot name="header" />
                <div v-if="slots.actions" class="flex shrink-0 gap-2">
                    <slot name="actions" />
                </div>
            </div>
            <slot />
        </div>
    </AppHeaderLayout>

    <Sonner :theme="(appearanceStore.appearance.value as Theme)" position="bottom-right" />
    <ConfirmDialog />
    <ReleasenotesDialog />
</template>
