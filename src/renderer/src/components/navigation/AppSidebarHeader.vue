<script setup lang="ts">
import Breadcrumbs from '@components/Breadcrumbs.vue'
import type { BreadcrumbItem } from '@renderer/types/navigation'
import { Button } from '@ui/button'
import { isCurrent } from '@renderer/helpers/route'
import { BadgeCheck, LoaderCircle } from 'lucide-vue-next'
import { useSettingsStore } from '@renderer/composables/settingsStore'
import LoadCircle from '../LoadCircle.vue'

const settingsStore = useSettingsStore()

withDefaults(
    defineProps<{
        breadcrumbs?: BreadcrumbItem[]
    }>(),
    {
        breadcrumbs: () => []
    }
)
</script>

<template>
    <header
        class="border-sidebar-border/70 flex h-16 shrink-0 items-center gap-2 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4"
    >
        <div
            class="flex justify-between gap-2 w-full items-center border-b pb-3 pt-3"
            v-if="!isCurrent('settings')"
        >
            <template v-if="breadcrumbs && breadcrumbs.length > 0">
                <Breadcrumbs :breadcrumbs="breadcrumbs" />
            </template>
        </div>
        <div
            class="flex justify-between gap-2 w-full items-center border-b pb-3 pt-3"
            v-if="isCurrent('settings')"
        >
            <div class="flex-1 md:flex md:justify-end items-center">
                <Button @click="settingsStore.fireDebounceNow">
                    Save Settings
                    <LoaderCircle
                        v-if="settingsStore.formIsSaving"
                        class="animate-spin text-amber-500"
                    />
                    <BadgeCheck v-if="settingsStore.flashSavedIndicator" class="text-green-500" />
                    <LoadCircle
                        v-if="settingsStore.remainingTimeSaveSettings > 10"
                        :duration="settingsStore.debounceTime"
                        :remaining="settingsStore.remainingTimeSaveSettings"
                    />
                </Button>
            </div>

            <template v-if="breadcrumbs && breadcrumbs.length > 0">
                <Breadcrumbs :breadcrumbs="breadcrumbs" />
            </template>
        </div>
    </header>
</template>
