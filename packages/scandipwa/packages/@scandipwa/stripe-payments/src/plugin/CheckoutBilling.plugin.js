/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */
import { cloneElement, isValidElement } from 'react';

export class CheckoutBillingPlugin {
    aroundRenderPayments = (args, callback, instance) => {
        const {
            totals: cartTotals,
            paymentTotals
        } = instance.props;
        const totals = Object.keys(paymentTotals).length ? paymentTotals : cartTotals;

        const originalElement = callback.apply(instance, args);
        const additionalProps = {
            paymentTotals: totals
        };

        if (!isValidElement(originalElement)) {
            return null;
        }

        return cloneElement(
            originalElement,
            additionalProps
        );
    };
}

const {
    aroundRenderPayments
} = new CheckoutBillingPlugin();

export const config = {
    'Component/CheckoutBilling/Component': {
        'member-function': {
            renderPayments: aroundRenderPayments
        }
    }
};

export default config;
