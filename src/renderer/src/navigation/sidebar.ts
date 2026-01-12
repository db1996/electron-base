import { NavItem } from '@renderer/types/navigation'
import { Home } from 'lucide-vue-next'

const sidebar = [
    {
        items: [
            {
                isDivider: true
            },
            {
                title: 'Home',
                route: 'home',
                current: 'home',
                icon: Home
            }
            // {
            //     title: 'Approve',
            //     route: 'approval',
            //     current: 'approval',
            //     icon: ListCheck
            // },
            // {
            //     title: 'History',
            //     route: 'history',
            //     current: 'history',
            //     icon: Clock
            // },
            // {
            //     title: 'Profiles',
            //     route: 'profiles',
            //     current: 'profiles',
            //     icon: UserCog
            // },
            // {
            //     title: 'Folder monitoring',
            //     route: 'folders',
            //     icon: FolderSync,
            //     current: 'folders.*',
            //     isVisible: true
            // },
            // {
            //     title: 'Content Templates',
            //     route: 'content-templates',
            //     icon: markRaw(FileBracesIcon),
            //     current: 'content-templates.*',
            //     isVisible: true
            // }
        ] as NavItem[]
    }
]

export default sidebar
