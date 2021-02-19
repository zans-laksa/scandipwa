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

import { prepareQuery } from 'Util/Query';
import { executeGet } from 'Util/Request';
import { ONE_MONTH_IN_SECONDS } from 'Util/Request/QueryDispatcher';

import StripeQuery from '../../query/Stripe.query';
import { Address, PaymentTotals } from '../../type/Stripe';
import Stripe from './Stripe.component';
import { STRIPE_MODE_TEST } from './Stripe.config';

/** @namespace StripePayments/Component/Stripe/Container/StripeContainer */
export class StripeContainer extends PureComponent {
    static propTypes = {
        setStripeRef: PropTypes.func.isRequired,
        billingAddress: Address.isRequired,
        onPaymentMethod: PropTypes.func.isRequired,
        paymentTotals: PaymentTotals.isRequired
    };

    state = {
        isLoading: true,
        storeConfig: {}
    };

    __construct(props) {
        super.__construct(props);

        if (window.Stripe) {
            this._requestStripeData();
        } else {
            const script = document.createElement('script');
            script.src = 'https://js.stripe.com/v3/';
            script.crossOrigin = true;
            document.head.appendChild(script);
            script.addEventListener('load', () => {
                this._requestStripeData();
            }, false);
        }
    }

    containerProps = () => {
        const { isLoading } = this.state;
        const {
            setStripeRef,
            billingAddress,
            onPaymentMethod,
            paymentTotals
        } = this.props;

        return {
            isLoading,
            setStripeRef,
            billingAddress,
            onPaymentMethod,
            paymentTotals,
            stripeKey: this._getStripeKey()
        };
    };

    _requestStripeData() {
        const query = StripeQuery.getStripeConfig();

        executeGet(prepareQuery([query]), 'StripeContainer', ONE_MONTH_IN_SECONDS).then(
            /** @namespace StripePayments/Component/Stripe/Container/executeGet/then */
            ({ storeConfig }) => this.setState({ isLoading: false, storeConfig })
        ).catch(
            /** @namespace StripePayments/Component/Stripe/Container/executeGet/then/catch */
            () => this.setState({ isLoading: false })
        );
    }

    _getStripeKey() {
        const {
            storeConfig: {
                stripe_mode,
                stripe_live_pk,
                stripe_test_pk
            }
        } = this.state;

        return stripe_mode === STRIPE_MODE_TEST
            ? stripe_test_pk
            : stripe_live_pk;
    }

    render() {
        return (
            <Stripe { ...this.containerProps() } />
        );
    }
}

export default StripeContainer;
