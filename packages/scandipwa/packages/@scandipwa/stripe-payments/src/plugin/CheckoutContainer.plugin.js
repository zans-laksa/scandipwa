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
export const STRIPE_AUTH_REQUIRED = 'Authentication Required: ';

export class CheckoutContainerPlugin {
    preservePaymentInformation = (args, callback) => {
        const [paymentInformation] = args;

        this.paymentInformation = paymentInformation;

        return callback(...args);
    };

    stripeAuthorization = (args, callback, instance) => {
        const [error] = args;
        const { paymentInformation } = this;

        if (!paymentInformation) {
            return callback(...args);
        }

        const [{ debugMessage: message = '' }] = error;
        const { paymentMethod: { handleAuthorization } } = paymentInformation;

        if (handleAuthorization && message.startsWith(STRIPE_AUTH_REQUIRED)) {
            const secret = message.substring(STRIPE_AUTH_REQUIRED.length);

            handleAuthorization(
                paymentInformation,
                secret,
                (newPaymentInformation) => instance.savePaymentInformation(newPaymentInformation)
            ).then((success) => {
                if (!success) {
                    instance.setState({ isLoading: false });
                }
            });

            return null;
        }

        return callback(...args);
    };
}

const {
    stripeAuthorization,
    preservePaymentInformation
} = new CheckoutContainerPlugin();

export const config = {
    'Route/Checkout/Container': {
        'member-function': {
            _handleError: stripeAuthorization,
            savePaymentInformation: preservePaymentInformation
        }
    }
};

export default config;
