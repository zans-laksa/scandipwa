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

import { BILLING_STEP } from 'Route/Checkout/Checkout.config';

import { STRIPE } from './CheckoutPayments.plugin';

export class CheckoutBillingContainerPlugin {
    around_getPaymentData = (args, callback, instance) => {
        const [asyncData] = args;
        const { paymentMethod: code } = instance.state;

        if (code === STRIPE) {
            const [{ token, handleAuthorization }] = asyncData;
            if (token === null) {
                return false;
            }

            return {
                code,
                additional_data: {
                    cc_stripejs_token: token,
                    cc_save: false
                },
                handleAuthorization
            };
        }

        return callback.apply(instance, args);
    };

    around_render = (args, callback, instance) => {
        const originalElement = callback.apply(instance, args);
        const additionalProps = {
            shippingAddress: this.getShippingAddress(instance)
        };

        if (!isValidElement(originalElement)) {
            return null;
        }

        return cloneElement(
            originalElement,
            additionalProps
        );
    };

    getShippingAddress = (instance) => {
        const { shippingAddress } = instance.props;

        if (shippingAddress && Object.keys(shippingAddress).length) {
            return shippingAddress;
        }

        const form = document.getElementById(BILLING_STEP);

        if (!form) {
            return {};
        }

        return instance._getAddress(
            Array.from(
                form.elements,
                ({ name, value }) => [name, value]
            ).reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {})
        );
    };
}

const {
    around_getPaymentData,
    around_render
} = new CheckoutBillingContainerPlugin();

export const config = {
    'Component/CheckoutBilling/Container': {
        'member-function': {
            _getPaymentData: around_getPaymentData,
            render: around_render
        }
    }
};

export default config;
