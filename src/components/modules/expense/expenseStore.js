import axios from "axios";
import formatValidationErrors from "../../utils/format-validation-errors";
import { defineStore } from "pinia";
import { useNotificationStore } from "../../components/shared/notification/notificationStore";

export const useExpenseStore = defineStore("expense", {
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

        expenses: [],

        edit_expense_id: null,
        view_expense_id: null,

        add_expense_errors: {},

        edit_expense_errors: {},

        current_expense_item: {
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
        resetCurrentExpenseData() {
            this.current_expense_item = {
                id: "",
                title: "",
                amount: "",
                date: "",
                description: "",
                categories: [],
            };
            this.add_expense_errors = [];
            this.edit_expense_errors = [];
        },

        async fetchExpenses(page, limit, q_title = "") {
            try {
                const response = await axios.get(
                    `/api/expenses?page=${page}&limit=${limit}&title=${q_title}&category=${this.q_category}&start_amount=${this.q_start_amount}&end_amount=${this.q_end_amount}&start_date=${this.q_start_date}&end_date=${this.q_end_date}&sort_column=${this.q_sort_column}&sort_order=${this.q_sort_order}`
                );
                this.expenses = response.data.data;
                if (response.data.meta) {
                    this.total_pages = response.data.meta.last_page;
                    this.current_page = response.data.meta.current_page;
                    this.limit = response.data.meta.per_page;
                    this.q_title = q_title;
                }
                return this.expenses;
            } catch (errors) {
                throw errors;
            }
        },

        async fetchExpense(id) {
            try {
                const response = await axios.get(`/api/expenses/${id}`);
                this.current_expense_item = response.data.data;

                this.current_expense_item.categories_details =
                    response.data.data.categories;

                this.current_expense_item.categories = response.data.data.categories.map(
                    (item) => item.value
                );
                return response.data.data;
            } catch (errors) {
                throw errors;
            }
        },

        async addExpense(data) {
            try {
                const response = await axios.post(`/api/expenses`, data);
                this.resetCurrentExpenseData();
                const notificationStore = useNotificationStore();
                notificationStore.pushNotification({
                    message: "Expense Added Successfully",
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
                    this.add_expense_errors = formatValidationErrors(
                        error.response.data.errors
                    );
                }
                throw error;
            }
        },

        async editExpense(data) {
            try {
                const response = await axios.put(
                    `/api/expenses/${this.edit_expense_id}`,
                    data
                );
                this.resetCurrentExpenseData();
                const notificationStore = useNotificationStore();
                notificationStore.pushNotification({
                    message: "expense record updated successfully",
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
                    this.edit_expense_errors = formatValidationErrors(
                        errors.response.data.errors
                    );
                }
                throw errors;
            }
        },

        async deleteExpense(id) {
            try {
                const response = await axios.delete(`/api/expenses/${id}`);
                if (
                    this.expenses.length == 1 ||
                    (Array.isArray(id) && id.length == this.expenses.length)
                ) {
                    this.current_page == 1
                        ? (this.current_page = 1)
                        : (this.current_page -= 1);
                }

                this.resetCurrentExpenseData();
                const notificationStore = useNotificationStore();
                notificationStore.pushNotification({
                    message: "expense deleted successfully",
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
