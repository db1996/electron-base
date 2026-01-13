<script setup lang="ts">
import AppLogo from '@components/AppLogo.vue'
import Breadcrumbs from '@components/Breadcrumbs.vue'
import { BreadcrumbItem } from '@renderer/types/navigation'

interface Props {
    breadcrumbs?: BreadcrumbItem[]
}

const props = withDefaults(defineProps<Props>(), {
    breadcrumbs: () => []
})
</script>

<template>
    <div>
        <div class="border-sidebar-border/80 border-b">
            <div class="mx-auto flex h-16 items-center px-4 md:max-w-7xl gap-3">
                <AppLogo />
                <slot />
            </div>
        </div>

        <div
            v-if="props.breadcrumbs.length > 1"
            class="border-sidebar-border/70 flex w-full border-b"
        >
            <div
                class="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl"
            >
                <Breadcrumbs :breadcrumbs="breadcrumbs || []" />
            </div>
        </div>
    </div>
</template>
