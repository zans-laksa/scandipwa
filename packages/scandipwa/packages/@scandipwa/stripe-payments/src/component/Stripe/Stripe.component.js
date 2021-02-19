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

import { Elements, ElementsConsumer } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PropTypes from 'prop-types';

import Loader from 'Component/Loader';

import { Address, PaymentTotals } from '../../type/Stripe';
import InjectedStripeCheckoutForm from '../InjectedStripeCheckoutForm';

import './Stripe.style';

/** @namespace StripePayments/Component/Stripe/Component/StripeComponent */
export class StripeComponent extends PureComponent {
    static propTypes = {
        isLoading: PropTypes.bool,
        stripeKey: PropTypes.string,
        setStripeRef: PropTypes.func.isRequired,
        billingAddress: Address.isRequired,
        onPaymentMethod: PropTypes.func.isRequired,
        paymentTotals: PaymentTotals.isRequired
    };

    static defaultProps = {
        stripeKey: '',
        isLoading: false
    };

    renderNoStripeKey() {
        return (
            <p>{ __('Error loading Stripe! No API-key specified.') }</p>
        );
    }

    renderStripeForm() {
        const {
            setStripeRef,
            stripeKey,
            billingAddress,
            onPaymentMethod,
            paymentTotals
        } = this.props;

        return (
            <Elements stripe={ loadStripe(stripeKey) }>
                <ElementsConsumer>
                    { ({ elements, stripe }) => {
                        if (!stripe || !elements) {
                            return null;
                        }

                        return (
                            <InjectedStripeCheckoutForm
                              onRef={ setStripeRef }
                              billingAddress={ billingAddress }
                              onPaymentMethod={ onPaymentMethod }
                              paymentTotals={ paymentTotals }
                              elements={ elements }
                              stripe={ stripe }
                            />
                        );
                    } }
                </ElementsConsumer>
            </Elements>
        );
    }

    renderContent() {
        const {
            stripeKey,
            isLoading
        } = this.props;

        if (isLoading) {
            return <Loader isLoading />;
        }

        if (!stripeKey) {
            return this.renderNoStripeKey();
        }

        return this.renderStripeForm();
    }

    render() {
        return (
            <div block="Stripe">
                { this.renderContent() }
            </div>
        );
    }
}

export default StripeComponent;
