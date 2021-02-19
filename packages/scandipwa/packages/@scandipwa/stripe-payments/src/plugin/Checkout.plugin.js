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
import { cloneElement } from 'react';

export class CheckoutPlugin {
    aroundRenderBillingStep = (args, callback, instance) => {
        const { paymentTotals, totals: cartTotals } = instance.props;
        const totals = Object.keys(paymentTotals).length ? paymentTotals : cartTotals;

        const originalElement = callback.apply(instance, args);
        const additionalProps = {
            paymentTotals: totals
        };

        return cloneElement(
            originalElement,
            additionalProps
        );
    };
}

const {
    aroundRenderBillingStep
} = new CheckoutPlugin();

export const config = {
    'Route/Checkout/Component': {
        'member-function': {
            renderBillingStep: aroundRenderBillingStep
        }
    }
};

export default config;
