
import axios from "axios";
import formatValidationErrors from "../../utils/format-validation-errors";
import { defineStore } from "pinia";
import { useNotificationStore } from "../../components/shared/notification/notificationStore";

export const useIncomeStore = defineStore("income", {
    state: () => ({
        current_page: 1,
        total_pages: 0,
        limit: 10,

        q_title: "",
        q_category: "",
        q_start_amount: "",
        q_end_amount: "",
        q_start_date: "",
        q_end_date: "",
        q_sort_column: "id",
        q_sort_order: "desc",

        incomes: [],

        edit_income_id: null,
        view_income_id: null,

        add_income_errors: {},

        edit_income_errors: {},

        current_income_item: {
            id: "",
            title: "",
            amount: "",
            date: "",
            description: "",
            categories: [],
        },
    }),

    getters: {},

    actions: {
        resetCurrentIncomeData() {
            this.current_income_item = {
                id: "",
                title: "",
                amount: "",
                date: "",
                description: "",
                categories: [],
            };
            this.add_income_errors = [];
            this.edit_income_errors = [];
        },

        async fetchIncomes(page, limit, q_title = "") {
            try {
                const response = await axios.get(
                    `/api/incomes?page=${page}&limit=${limit}&title=${q_title}&category=${this.q_category}&start_amount=${this.q_start_amount}&end_amount=${this.q_end_amount}&start_date=${this.q_start_date}&end_date=${this.q_end_date}&sort_column=${this.q_sort_column}&sort_order=${this.q_sort_order}`
                );
                this.incomes = response.data.data;
                if (response.data.meta) {
                    this.total_pages = response.data.meta.last_page;
                    this.current_page = response.data.meta.current_page;
                    this.limit = response.data.meta.per_page;
                    this.q_title = q_title;
                }
                return this.incomes;
            } catch (error) {
                throw error;
            }
        },

        async fetchIncome(id) {
            try {
                const response = await axios.get(`/api/incomes/${id}`);
                this.current_income_item = response.data.data;

                this.current_income_item.categories_details =
                    response.data.data.categories;

                this.current_income_item.categories =
                    response.data.data.categories.map((item) => item.value);
                return response.data.data;
            } catch (error) {
                throw error;
            }
        },

        async addIncome(data) {
            try {
                const response = await axios.post(`/api/incomes`, data);
                this.resetCurrentIncomeData();
                const notificationStore = useNotificationStore();
                notificationStore.pushNotification({
                    message: "Income Added Successfully",
                    type: "success",
                    time: 2000,
                });
                return response;
            } catch (error) {
                const notificationStore = useNotificationStore();
                notificationStore.pushNotification({
                    message: "Error Occurred",
                    type: "error",
                    time: 2000,
                });
                if (error.response.status == 422) {
                    this.add_income_errors = formatValidationErrors(
                        error.response.data.errors
                    );
                }
                throw error;
            }
        },

        async editIncome(data) {
            try {
                const response = await axios.put(
                    `/api/incomes/${this.edit_income_id}`,
                    data
                );
                this.resetCurrentIncomeData();
                const notificationStore = useNotificationStore();
                notificationStore.pushNotification({
                    message: "income record updated successfully",
                    type: "success",
                });
                return response;
            } catch (errors) {
                console.log(errors);
                const notificationStore = useNotificationStore();
                notificationStore.pushNotification({
                    message: "Error Occurred",
                    type: "error",
                });
                if (errors.response.status == 422) {
                    this.edit_income_errors = formatValidationErrors(
                        errors.response.data.errors
                    );
                }
                throw errors;
            }
        },

        async deleteIncome(id) {
            try {
                const response = await axios.delete(`/api/incomes/${id}`);
                if (
                    this.incomes.length == 1 ||
                    (Array.isArray(id) && id.length == this.incomes.length)
                ) {
                    this.current_page == 1
                        ? (this.current_page = 1)
                        : (this.current_page -= 1);
                }
                this.resetCurrentIncomeData();
                const notificationStore = useNotificationStore();
                notificationStore.pushNotification({
                    message: "income deleted successfully",
                    type: "success",
                    time: 2000,
                });
                return response;
            } catch (error) {
                throw error;
            }
        },
    },
});

