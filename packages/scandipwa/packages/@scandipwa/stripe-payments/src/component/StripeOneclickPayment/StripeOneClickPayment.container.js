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

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { showNotification } from 'Store/Notification/Notification.action';

import { Address, PaymentTotals, Stripe } from '../../type/Stripe';
import StripeOneClickPayment from './StripeOneClickPayment.component';

/** @namespace StripePayments/Component/StripeOneclickPayment/StripeOneClickPayment/Container/mapStateToProps */
export const mapStateToProps = () => ({});

/** @namespace StripePayments/Component/StripeOneclickPayment/StripeOneClickPayment/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    showNotification: (type, message) => dispatch(showNotification(type, message))
});

/** @namespace StripePayments/Component/StripeOneclickPayment/StripeOneClickPayment/Container/StripeOneClickPaymentContainer */
export class StripeOneClickPaymentContainer extends PureComponent {
    static propTypes = {
        paymentTotals: PaymentTotals.isRequired,
        billingAddress: Address.isRequired,
        stripe: Stripe.isRequired,
        showNotification: PropTypes.func.isRequired,
        onPaymentMethod: PropTypes.func.isRequired
    };

    state = {
        buttonPayEnabled: false
    };

    componentDidMount() {
        this.paymentRequest = this.generatePaymentRequest();
        this.paymentRequest.canMakePayment().then(
            /** @namespace StripePayments/Component/StripeOneclickPayment/StripeOneClickPayment/Container/canMakePayment/then */
            (can) => this.setState(() => ({ buttonPayEnabled: !!can }))
        );

        this.paymentRequest.on(
            'paymentmethod',
            (event) => this.handlePaymentMethod(event)
        );
    }

    containerProps = () => ({
        paymentRequest: this.paymentRequest
    });

    getOrderAmount() {
        /** Determine whether currency has subunits */
        const {
            paymentTotals: {
                grand_total,
                quote_currency_code
            } = {}
        } = this.props;

        const isZeroDecimal = (currency) => [
            'bif', 'djf',
            'jpy', 'krw',
            'pyg', 'vnd',
            'xaf', 'xpf',
            'clp', 'gnf',
            'kmf', 'mga',
            'rwf', 'vuv',
            'xof'
        ].includes(currency.toLowerCase());

        const n = 100;

        return Math.floor(grand_total * (isZeroDecimal(quote_currency_code) ? 1 : n));
    }

    generatePaymentRequest() {
        const {
            stripe,
            paymentTotals: {
                quote_currency_code
            },
            billingAddress: {
                country_id
            }
        } = this.props;

        const paymentRequest = stripe.paymentRequest({
            country: country_id,
            currency: quote_currency_code.toLowerCase(),
            total: {
                label: 'Get your goods!',
                amount: this.getOrderAmount()
            }
        });

        return paymentRequest;
    }

    handleError(error) {
        const { showNotification } = this.props;
        showNotification('error', error.message);
    }

    handlePaymentMethod(process) {
        const {
            onPaymentMethod
        } = this.props;

        const { paymentMethod } = process;

        onPaymentMethod(paymentMethod);
        process.complete('success');
    }

    render() {
        const { buttonPayEnabled } = this.state;

        if (!buttonPayEnabled) {
            return null;
        }

        return (
            <StripeOneClickPayment
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StripeOneClickPaymentContainer);
