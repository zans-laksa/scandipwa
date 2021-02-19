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

import { PaymentRequestButtonElement } from '@stripe/react-stripe-js';

import { PaymentRequest } from '../../type/Stripe';

/** @namespace StripePayments/Component/StripeOneclickPayment/StripeOneClickPayment/Component/StripeOneClickPaymentComponent */
export class StripeOneClickPaymentComponent extends PureComponent {
    static propTypes = {
        paymentRequest: PaymentRequest.isRequired
    };

    render() {
        const { paymentRequest } = this.props;

        return (
            <div block="InjectedStripeCheckoutForm" elem="ButtonPay">
                <PaymentRequestButtonElement
                  paymentRequest={ paymentRequest }
                />
            </div>
        );
    }
}

export default StripeOneClickPaymentComponent;
