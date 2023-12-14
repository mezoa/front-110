import axios from "axios";
import formatValidationErrors from "../../utils/format-validation-error";
import { defineStore } from "pinia";
import { useNotificationStore } from "../../components/shared/notification/notificationStore";

export const useIncomeCategoryStore = defineStore("income_category", {
    state: () => ({
        current_page: 1,
        total_pages: 0,
        limit: 10,

        q_name: "",

        income_categories: [],

        edit_income_category_id: null,
        view_income_category_id: null,

        add_income_category_errors: {},

        edit_income_category_errors: {},

        current_income_category_item: {
            id: "",
            name: "",
        },
    }),

    getters: {},

    actions: {
        resetCurrentIncomeCatData() {
            this.current_income_category_item = {
                id: "",
                name: "",
            };
            this.add_income_category_errors = [];
            this.edit_income_category_errors = [];
        },

        async fetchCatList() {
            try {
                const response = await axios.get(`/api/income-categories/list`);
                return response.data.data;
            } catch (errors) {
                throw errors;
            }
        },

        async fetchIncomeCats(page, limit, q_name = "") {
            try {
                const response = await axios.get(
                    `/api/income-categories?page=${page}&limit=${limit}&name=${q_name}`
                );
                this.income_categories = response.data.data;
                if (response.data.meta) {
                    this.total_pages = response.data.meta.last_page;
                    this.current_page = response.data.meta.current_page;
                    this.limit = response.data.meta.per_page;
                    this.q_name = q_name;
                }
                return this.income_categories;
            } catch (errors) {
                throw errors;
            }
        },

        async fetchIncomeCat(id) {
            try {
                const response = await axios.get(`/api/income-categories/${id}`);
                this.current_income_category_item = response.data.data;
                return response.data.data;
            } catch (errors) {
                throw errors;
            }
        },

        async addIncomeCat(data) {
            try {
                const response = await axios.post(`/api/income-categories`, data);
                this.resetCurrentIncomeCatData();
                const notifcationStore = useNotificationStore();
                notifcationStore.pushNotification({
                    message: "IncomeCat Added Successfully",
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
                    this.add_income_category_errors = formatValidationErrors(
                        error.response.data.errors
                    );
                }
                throw error;
            }
        },

        async editIncomeCat(data) {
            try {
                const response = await axios.put(
                    `/api/income-categories/${this.edit_income_category_id}`,
                    data
                );
                this.resetCurrentIncomeCatData();
                const notifcationStore = useNotificationStore();
                notifcationStore.pushNotification({
                    message: "income category updated successfully",
                    type: "success",
                });
                return response;
            } catch (errors) {
                console.log(errors);
                const notifcationStore = useNotificationStore();
                notifcationStore.pushNotification({
                    message: "Error Occurred",
                    type: "error",
                });
                if (errors.response.status == 422) {
                    this.edit_income_category_errors = formatValidationErrors(
                        errors.response.data.errors
                    );
                }
                throw errors;
            }
        },

        async deleteIncomeCat(id) {
            try {
                const response = await axios.delete(`/api/income-categories/${id}`);
                if (
                    this.income_categories.length == 1 ||
                    (Array.isArray(id) && id.length == this.income_categories.length)
                ) {
                    this.current_page == 1 ? (this.current_page = 1) : (this.current_page -= 1);
                }
                this.resetCurrentIncomeCatData();
                const notifcationStore = useNotificationStore();
                notifcationStore.pushNotification({
                    message: "income category deleted successfully",
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
                            "Category is associated with non zero income records. Delete that incomes first.",
                        type: "error",
                        time: 5000,
                    });
                }
                throw errors;
            }
        },
    },
});
