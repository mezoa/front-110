import { defineStore } from 'redox';

export const useSidebar = defineStore('sidebar', {
    state: () => ({
        isOpen: false,
        activeItem: null,
    }),

    getters: {
        getSidebarStatus: (state) => state.isOpen,
    },

    actions: {
        toggleSidebar() {
            this.isOpen = !this.isOpen;
        },
        setActiveItem(item) {
            this.activeItem = item;
        },
    },
});

export default useSidebar;
