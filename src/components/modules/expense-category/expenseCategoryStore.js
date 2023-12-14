
import axios from "axios";
import formatValidationErrors from "../../utils/format-validation-error";
import { defineStore } from "pinia";
import { useNotificationStore } from "../../shared/notification/notificationstore";

export const useExpenseCategoryStore = defineStore("expense_category", {
    state: () => ({
        current_page: 1,
        total_pages: 0,
        limit: 10,

        q_name: "",

        expense_categories: [],

        edit_expense_category_id: null,
        view_expense_category_id: null,

        add_expense_category_errors: {},

        edit_expense_category_errors: {},

        current_expense_category_item: {
            id: "",
            name: "",
        },
    }),

    getters: {},

    actions: {
        resetCurrentExpenseCatData() {
            this.current_expense_category_item = {
                id: "",
                name: "",
            };
            this.add_expense_category_errors = [];
            this.edit_expense_category_errors = [];
        },

        async fetchCatList() {
            try {
                const response = await axios.get(`/api/expense-categories/list`);
                return response.data.data;
            } catch (errors) {
                throw errors;
            }
        },

        async fetchExpenseCats(page, limit, q_name = "") {
            try {
                const response = await axios.get(
                    `/api/expense-categories?page=${page}&limit=${limit}&name=${q_name}`
                );
                this.expense_categories = response.data.data;
                if (response.data.meta) {
                    this.total_pages = response.data.meta.last_page;
                    this.current_page = response.data.meta.current_page;
                    this.limit = response.data.meta.per_page;
                    this.q_name = q_name;
                }
                return this.expense_categories;
            } catch (errors) {
                throw errors;
            }
        },

        async fetchExpenseCat(id) {
            try {
                const response = await axios.get(`/api/expense-categories/${id}`);
                this.current_expense_category_item = response.data.data;
                return response.data.data;
            } catch (errors) {
                throw errors;
            }
        },

        async addExpenseCat(data) {
            try {
                const response = await axios.post(`/api/expense-categories`, data);
                this.resetCurrentExpenseCatData();
                const notifcationStore = useNotificationStore();
                notifcationStore.pushNotification({
                    message: "ExpenseCat Added Successfully",
                    type: "success",
                    time: 2000,
                });
                return response;
            } catch (error) {
                const notifcationStore = useNotificationStore();
                notifcationStore.pushNotification({
                    message: "Error Occurred",
                    type: "error",
                    time: 2000,
                });

                if (error.response.status == 422) {
                    this.add_expense_category_errors = formatValidationErrors(
                        error.response.data.errors
                    );
                }
                throw error;
            }
        },

        async editExpenseCat(data) {
            try {
                const response = await axios.put(
                    `/api/expense-categories/${this.edit_expense_category_id}`,
                    data
                );
                this.resetCurrentExpenseCatData();
                const notifcationStore = useNotificationStore();
                notifcationStore.pushNotification({
                    message: "expense category updated successfully",
                    type: "success",
                });
                return response;
            } catch (errors) {
                const notifcationStore = useNotificationStore();
                notifcationStore.pushNotification({
                    message: "Error Occurred",
                    type: "error",
                });

                if (errors.response.status == 422) {
                    this.edit_expense_category_errors = formatValidationErrors(
                        errors.response.data.errors
                    );
                }
                throw errors;
            }
        },

        async deleteExpenseCat(id) {
            try {
                const response = await axios.delete(`/api/expense-categories/${id}`);
                if (
                    this.expense_categories.length == 1 ||
                    (Array.isArray(id) && id.length == this.expense_categories.length)
                ) {
                    this.current_page == 1
                        ? (this.current_page = 1)
                        : (this.current_page -= 1);
                }

                this.resetCurrentExpenseCatData();
                const notifcationStore = useNotificationStore();
                notifcationStore.pushNotification({
                    message: "expense category deleted successfully",
                    type: "success",
                    time: 2000,
                });
                return response;
            } catch (errors) {
                if (
                    errors.response.data.error_type &&
                    errors.response.data.error_type == "HAS_CHILD_ERROR"
                ) {
                    const notifcationStore = useNotificationStore();
                    notifcationStore.pushNotification({
                        message:
                            "Category is associated with non zero expense records. Delete that expenses first.",
                        type: "error",
                        time: 5000,
                    });
                }
                throw errors;
            }
        },
    },
});

