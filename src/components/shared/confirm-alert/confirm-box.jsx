import React from "react";
import { useEffect } from "react";
import { useConfirmStore } from "./confirmStore";

const ConfirmBox = ({ data, close }) => {
    const confirmStore = useConfirmStore();

    useEffect(() => {
        return () => {
            // onBeforeUnmount equivalent
        };
    }, []);

    return (
        <div>
            <div className="confirm_box_container">
                <div className="confirm_box">
                    <p>{confirmStore.message}</p>
                    <div>
                        <a
                            className="btn btn-danger me-2"
                            onClick={confirmStore.confirm_action}
                        >
                            yes
                        </a>
                        <a
                            className="btn btn-primary"
                            onClick={confirmStore.cancel_action}
                        >
                            cancel
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmBox;

// CSS styles can be added as a separate file or using CSS-in-JS libraries like styled-components.
