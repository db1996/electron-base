<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import AppLayout from '@renderer/layout/AppLayout.vue'
import { useSettingsStore } from '@renderer/composables/settingsStore'
import { X } from 'lucide-vue-next'
import { BadgeVariants } from '@renderer/components/ui/badge'
import { Tabs, TabsContent, TabsList } from '@components/ui/tabs'
import TabsTriggerSection from '@renderer/components/navigation/TabsTriggerSection.vue'
import { AllSettings } from '@main/types/settings/AllSettings'
import GeneralSettings from './_partials/GeneralSettings.vue'
import SystemSettings from './_partials/SystemSettings.vue'

const settingsStore = useSettingsStore()

const sections = ref([
    {
        id: 'general',
        label: 'General',
        badgeVariant: 'destructive' as BadgeVariants['variant'],
        badgeIcon: X
    },
    {
        id: 'system',
        label: 'System and updates'
    }
])

const lastSettingsForm = ref<AllSettings | null>(null)

onMounted(async () => {
    console.log(settingsStore.form)
})

watch(
    () => settingsStore.form,
    newVal => {
        if (
            JSON.stringify(newVal) !== JSON.stringify(lastSettingsForm.value) &&
            lastSettingsForm.value !== null
        ) {
            settingsStore.saveSettingsFormDebounce()
        }
        lastSettingsForm.value = JSON.parse(JSON.stringify(newVal))
    },
    { deep: true }
)
</script>

<template>
    <AppLayout>
        <Tabs default-value="general" class="flex flex-col gap-4">
            <TabsList class="grid w-full settings-tablist">
                <TabsTriggerSection
                    :section="sections.find(s => s.id === 'general')!"
                    class="general-trigger"
                />
                <TabsTriggerSection
                    :section="sections.find(s => s.id === 'system')!"
                    class="system-trigger"
                />
            </TabsList>
            <TabsContent value="general">
                <GeneralSettings v-if="settingsStore.form" :form="settingsStore.form" />
            </TabsContent>
            <TabsContent value="system">
                <SystemSettings v-if="settingsStore.form" :form="settingsStore.form" />
            </TabsContent>
        </Tabs>
    </AppLayout>
</template>
<style lang="css" scoped>
.settings-tablist {
    grid-template-columns: [general] 90px [unused] 1fr [system] 155px;
}

.general-trigger {
    grid-area: general;
}

.system-trigger {
    grid-area: system;
}
</style>
