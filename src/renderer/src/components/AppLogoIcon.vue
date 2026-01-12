<script setup lang="ts">
import { getCurrentAppearance } from '@renderer/composables/useAppearance'
import { computed, type HTMLAttributes } from 'vue'
import lightTheme from '@icons/sidebar/logo-light.svg'
import darkTheme from '@icons/sidebar/logo-dark.svg'
import darkThemeSmall from '@icons/sidebar/logo-dark-small.svg'
import lightThemeSmall from '@icons/sidebar/logo-light-small.svg'
import { useSidebar } from './ui/sidebar'

const { open } = useSidebar()

defineOptions({
    inheritAttrs: false
})

interface Props {
    className?: HTMLAttributes['class']
}

defineProps<Props>()

const source = computed(() => {
    if (getCurrentAppearance() === 'light') {
        return lightTheme
    } else {
        return darkTheme
    }
})

const sourceSmall = computed(() => {
    if (getCurrentAppearance() === 'light') {
        return lightThemeSmall
    } else {
        return darkThemeSmall
    }
})
</script>

<template>
    <img v-show="open" :src="source" alt="Logo" class="max-w-[150px] max-h-[50px]" />
    <img v-show="!open" :src="sourceSmall" alt="Logo" class="mx-auto max-h-[32px]" />
</template>
