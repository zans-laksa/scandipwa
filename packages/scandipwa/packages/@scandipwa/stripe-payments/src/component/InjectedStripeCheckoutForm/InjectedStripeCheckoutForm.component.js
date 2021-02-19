/* eslint-disable react/no-unused-state */
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

import { CardElement } from '@stripe/react-stripe-js';
import PropTypes from 'prop-types';

import { Address, PaymentTotals, Stripe } from '../../type/Stripe';
import StripeOneClickPayment from '../StripeOneclickPayment';

import './InjectedStripeCheckoutForm.style';

/**
 * @class InjectedStripeCheckoutForm
 * @namespace StripePayments/Component/InjectedStripeCheckoutForm/Component/InjectedStripeCheckoutFormComponent */
export class InjectedStripeCheckoutFormComponent extends PureComponent {
    static propTypes = {
        paymentTotals: PaymentTotals.isRequired,
        billingAddress: Address.isRequired,
        stripe: Stripe.isRequired,
        showNotification: PropTypes.func.isRequired,
        onPaymentMethod: PropTypes.func.isRequired
    };

    render() {
        const {
            paymentTotals,
            billingAddress,
            stripe,
            showNotification,
            onPaymentMethod
        } = this.props;

        return (
            <div block="InjectedStripeCheckoutForm">
                <StripeOneClickPayment
                  paymentTotals={ paymentTotals }
                  billingAddress={ billingAddress }
                  stripe={ stripe }
                  showNotification={ showNotification }
                  onPaymentMethod={ onPaymentMethod }
                />
                <CardElement options={ { hidePostalCode: true } } />
            </div>
        );
    }
}

export default InjectedStripeCheckoutFormComponent;
