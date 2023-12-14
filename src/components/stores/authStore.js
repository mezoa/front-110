import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        fetched: false,
        user: {},
        authenticated: 0,
    }),

    getters: {},

    actions: {
        async getAuthUser() {
            try {
                const response = await axios.get(`/api/users/authenticated-user`);
                this.user = response.data.user;
                this.authenticated = response.data.authenticated;
            } catch (error) {
                console.error(error);
            }
        },

        // userCan(ability) {
        //     return this.permissions.includes(ability);
        // },
    },
});
