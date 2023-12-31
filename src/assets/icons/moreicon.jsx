import { defineProps } from 'vue';

export default {
    props: {
        color: String,
        background: String,
        width: String,
        height: String,
    },
    template: `
        <svg
            :width="width ? width : '16px'"
            :height="height ? height : '16px'"
            :fill="color ? color : 'white'"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
        >
            <!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
            <path
                d="M0 256a56 56 0 1 1 112 0A56 56 0 1 1 0 256zm160 0a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z"
            />
        </svg>
    `,
};
