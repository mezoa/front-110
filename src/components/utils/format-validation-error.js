import React from 'react';

export default function formatValidationErrors(errors) {
    const formattedErrors = {};

    Object.keys(errors).forEach((key) => {
        formattedErrors[key] = errors[key].toString();
    });

    return formattedErrors;
}
