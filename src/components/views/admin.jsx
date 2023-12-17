import React, { useEffect, useState } from "react";
import Sidebar from "../NavbarBars/Sidebar";
import Navbar from "../NavbarBars/Navbar";
import Loader from "../shared/loader/Loader";
import NotificationsContainer from "../shared/notification/notification-container";
import ConfirmBox from "../shared/confirm-alert/confirm-box";
import { useConfirmStore } from "../shared/confirm-alert/confirmStore";
import { useAuthStore } from "../stores/authStore";

const Admin = () => {
    const [adminReady, setAdminReady] = useState(false);
    const authStore = useAuthStore();
    const confirmStore = useConfirmStore();

    useEffect(() => {
        const fetchData = async () => {
            setAdminReady(false);

            await authStore.getAuthUser();

            if (authStore.authenticated !== 1) {
                window.location.href = "/";
            } else {
                setAdminReady(true);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            {!adminReady && (
                <div className="pt-5">
                    <Loader />
                </div>
            )}
            {adminReady && authStore.authenticated === 1 && (
                <div id="app">
                    <Sidebar />
                    <div id="main">
                        <Navbar />
                        <div className="main-content container-fluid">
                            {/* Replace <router-view /> with your React router component */}
                        </div>
                    </div>
                </div>
            )}
            <div className="admin-area-modals-container">
                {confirmStore.show_confirm_box && <ConfirmBox />}
                <NotificationsContainer />
            </div>
        </div>
    );
};

export default Admin;
