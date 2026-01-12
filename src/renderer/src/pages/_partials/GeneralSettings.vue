<script setup lang="ts">
import { Label } from '@ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@ui/select'
import { AllSettings } from '@main/types/settings/AllSettings'
import { PropType, watch } from 'vue'
import CardForm from '@renderer/components/form/CardForm.vue'
import { useAppearance } from '@renderer/composables/useAppearance'
import { Appearance } from '@renderer/types/appearance'

const props = defineProps({
    form: {
        type: Object as PropType<AllSettings>,
        required: true
    }
})
const appearanceStore = useAppearance()
watch(
    () => props.form.theme.type,
    newVal => {
        appearanceStore.updateAppearance(newVal as Appearance)
    }
)
</script>

<template>
    <div class="grid grid-cols-1 gap-2">
        <CardForm title="Theme settings">
            <template #body>
                <div class="grid grid-cols-2">
                    <div class="space-y-2">
                        <Label for="theme">Theme</Label>
                        <Select v-model="form.theme.type" required>
                            <SelectTrigger id="theme" class="w-[200px]">
                                <SelectValue placeholder="Select theme" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="system">System</SelectItem>
                            </SelectContent>
                        </Select>
                        <p class="text-sm text-muted-foreground">
                            Choose between light, dark, or system theme.
                        </p>
                    </div>
                    <div class="space-y-2">
                        <Label for="date-formats">Date format</Label>
                        <Select v-model="form.theme.datesLocale" required>
                            <SelectTrigger id="date-formats" class="w-[250px]">
                                <SelectValue placeholder="Select date format" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="us-US">mm/dd/yyyy hh:mm:ss AM</SelectItem>
                                <SelectItem value="nl-NL">dd-mm-yyyy hh:mm:ss</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </template>
        </CardForm>
    </div>
</template>
