<script setup lang="ts">
import { Label } from '@ui/label'
import { AllSettings } from '@main/types/settings/AllSettings'
import { PropType } from 'vue'
import SwitchInput from '@renderer/components/form/SwitchInput.vue'
import CardForm from '@renderer/components/form/CardForm.vue'
import { Button } from '@components/ui/button'
import { useUpdateStore } from '@renderer/composables/useUpdateStore'
import { LoaderCircle } from 'lucide-vue-next'
import Alert from '@renderer/components/ui/alert/Alert.vue'
import AlertTitle from '@renderer/components/ui/alert/AlertTitle.vue'
import AlertDescription from '@renderer/components/ui/alert/AlertDescription.vue'
const updateStore = useUpdateStore()

const props = defineProps({
    form: {
        type: Object as PropType<AllSettings>,
        required: true
    }
})
</script>

<template>
    <div class="grid grid-cols-1 gap-2">
        <CardForm title="Tray and System settings">
            <template #body>
                <div class="flex items-center justify-between">
                    <div class="space-y-2">
                        <Label for="show-tray-icon">Show system tray icon</Label>
                        <p class="text-sm text-muted-foreground mr-2">
                            When enabled, the system tray icon will be shown.
                        </p>
                    </div>
                    <SwitchInput id="show-tray-icon" v-model="form.system.showTrayIcon" />
                </div>
                <div class="flex items-center justify-between">
                    <div class="space-y-2">
                        <Label for="minimize-to-tray">Minimize to System Tray</Label>
                        <p class="text-sm text-muted-foreground mr-2">
                            When enabled, closing the window will minimize the app to the system
                            tray instead of quitting. Requires "Show system tray icon" to be
                            enabled.
                        </p>
                    </div>
                    <SwitchInput
                        :disabled="!form.system.showTrayIcon"
                        id="minimize-to-tray"
                        v-model="form.system.minimizeToTray"
                    />
                </div>
                <div class="flex items-center justify-between">
                    <div class="space-y-2">
                        <Label for="start-in-tray">Start in Tray</Label>
                        <p class="text-sm text-muted-foreground mr-2">
                            When enabled, the application will start minimized to the system tray.
                        </p>
                    </div>
                    <SwitchInput
                        :disabled="!form.system.showTrayIcon"
                        id="start-in-tray"
                        v-model="form.system.startInTray"
                    />
                </div>

                <div class="flex items-center justify-between">
                    <div class="space-y-2">
                        <Label for="start-with-system">Start with System</Label>
                        <p class="text-sm text-muted-foreground mr-2">
                            When enabled, the application will automatically start when the system
                            boots up.
                        </p>
                    </div>
                    <SwitchInput id="start-with-system" v-model="form.system.startWithSystem" />
                </div>
            </template>
        </CardForm>

        <CardForm title="Updates">
            <template #body>
                <div class="space-y-2">
                    <div class="grid grid-cols-2 gap-4 space-y-2">
                        <div class="grid grid-cols-1 gap-2">
                            <Alert
                                v-if="updateStore.updateState === 'error'"
                                variant="destructive"
                                title="Update Error"
                                description="An error occurred while checking for updates."
                                class="max-h-[200px] overflow-y-scroll overflow-wrap-anywhere"
                            >
                                <AlertTitle>Error with updater</AlertTitle>
                                <AlertDescription>
                                    {{ updateStore.errorMessage }}
                                </AlertDescription>
                            </Alert>
                            <Button
                                v-if="
                                    updateStore.updateState === 'checking' ||
                                    updateStore.updateState === 'downloading'
                                "
                                variant="outline_default"
                                disabled
                            >
                                {{
                                    updateStore.updateState === 'checking'
                                        ? 'Checking for updates...'
                                        : 'Downloading update...'
                                }}
                                <LoaderCircle class="animate-spin" />
                            </Button>
                            <Button
                                v-if="
                                    updateStore.updateState === 'idle' ||
                                    updateStore.updateState === 'unavailable' ||
                                    updateStore.updateState === 'error'
                                "
                                variant="outline_default"
                                @click="() => updateStore.checkForUpdates()"
                            >
                                Check for Updates
                            </Button>

                            <Button
                                v-if="updateStore.updateState === 'available'"
                                variant="outline_info"
                                @click="() => updateStore.downloadUpdate()"
                            >
                                Download Update
                            </Button>
                            <Button
                                v-if="updateStore.updateState === 'downloaded'"
                                variant="default"
                                @click="() => updateStore.installUpdate()"
                            >
                                Install Update
                            </Button>

                            <Button
                                v-if="
                                    updateStore.updateInfo &&
                                    updateStore.updateState !== 'unavailable' &&
                                    updateStore.updateState !== 'error' &&
                                    updateStore.updateState !== 'idle' &&
                                    updateStore.updateState !== 'checking'
                                "
                                variant="outline_default"
                                @click="updateStore.showReleaseNotes = true"
                            >
                                See release notes
                            </Button>
                        </div>
                        <div>
                            <p class="text-sm text-muted-foreground">
                                Current Version: {{ updateStore.currentVersion }}
                            </p>
                            <p class="text-sm text-muted-foreground">
                                Latest Version:
                                {{
                                    updateStore.updateInfo ? updateStore.updateInfo.version : 'N/A'
                                }}
                            </p>
                        </div>
                    </div>

                    <div class="grid grid-cols-3 space-y-2 mt-4 gap-2">
                        <SwitchInput
                            id="auto-check-updates"
                            v-model="form.updater.updateCheckAutomatically"
                            label="Automatically check updates at startup"
                        />
                        <SwitchInput
                            id="auto-download-updates"
                            v-model="form.updater.updateDownloadAutomatically"
                            label="Automatically download updates"
                        />
                        <SwitchInput
                            id="auto-install-updates"
                            v-model="form.updater.updateInstallAutomatically"
                            label="Automatically install updates"
                        />
                    </div>
                </div>
            </template>
        </CardForm>
    </div>
</template>
