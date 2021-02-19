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
import Stripe from '../component/Stripe';

export const STRIPE = 'stripe_payments';

export class CheckoutPaymentsPlugin {
    aroundPaymentRenderMap = (originalMember, instance) => ({
        ...originalMember,
        [STRIPE]: this.renderStripePayment.bind(instance)
    });

    renderStripePayment() {
        const {
            billingAddress,
            setStripeRef,
            paymentTotals,
            totals: cartTotals,
            onPaymentMethod
        } = this.props;
        const totals = Object.keys(paymentTotals).length ? paymentTotals : cartTotals;

        return (
            <Stripe
              billingAddress={ billingAddress }
              setStripeRef={ setStripeRef }
              paymentTotals={ totals }
              onPaymentMethod={ onPaymentMethod }
            />
        );
    }
}

const {
    aroundPaymentRenderMap
} = new CheckoutPaymentsPlugin();

export const config = {
    'Component/CheckoutPayments/Component': {
        'member-property': {
            paymentRenderMap: aroundPaymentRenderMap
        }
    }
};

export default config;
