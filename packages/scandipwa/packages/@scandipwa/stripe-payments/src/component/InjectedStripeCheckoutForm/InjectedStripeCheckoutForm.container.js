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
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { showNotification } from 'Store/Notification/Notification.action';

import {
    Address,
    PaymentTotals,
    Stripe,
    StripeElements
} from '../../type/Stripe';
import InjectedStripeCheckoutForm from './InjectedStripeCheckoutForm.component';

/** @namespace StripePayments/Component/InjectedStripeCheckoutForm/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    showNotification: (type, message) => dispatch(showNotification(type, message))
});

/** @namespace StripePayments/Component/InjectedStripeCheckoutForm/Container/mapStateToProps */
export const mapStateToProps = () => ({});

/** @namespace StripePayments/Component/InjectedStripeCheckoutForm/Container/InjectedStripeCheckoutFormContainer */
export class InjectedStripeCheckoutFormContainer extends PureComponent {
    static propTypes = {
        stripe: Stripe.isRequired,
        email: PropTypes.string,
        billingAddress: Address.isRequired,
        showNotification: PropTypes.func.isRequired,
        onRef: PropTypes.func.isRequired,
        paymentTotals: PaymentTotals.isRequired,
        onPaymentMethod: PropTypes.func.isRequired,
        elements: StripeElements.isRequired
    };

    static defaultProps = {
        email: null
    };

    componentDidMount() {
        const { onRef } = this.props;
        onRef(this);
    }

    componentWillUnmount() {
        const { onRef } = this.props;
        onRef(undefined);
    }

    __construct(props) {
        super.__construct(props);

        this.state = { complete: false };
        this.submit = this.submit.bind(this);
        this.handleAuthorization = this.handleAuthorization.bind(this);
    }

    containerProps() {
        const {
            paymentTotals,
            billingAddress,
            stripe,
            showNotification,
            onPaymentMethod
        } = this.props;

        return {
            paymentTotals,
            billingAddress,
            stripe,
            showNotification,
            onPaymentMethod
        };
    }

    /**
    * Handles the response from a card action or a card payment after authorization is complete
    * @param response the API response
    * @param savePaymentInformation
    * @param paymentInformation
    * @returns {boolean} true on success, false otherwise
    */
    handlePostAuthorization(response, savePaymentInformation, paymentInformation) {
        const { showNotification } = this.props;

        if (response.error) {
            showNotification('error', response.error.message);
            return false;
        }

        savePaymentInformation(paymentInformation);
        return true;
    }

    /**
    * If card required 3ds authorization - handle it and place order if success
    * @param paymentInformation
    * @param secret
    * @param savePaymentInformation
    */
    handleAuthorization(paymentInformation, secret, savePaymentInformation) {
        const {
            stripe: { retrievePaymentIntent, handleCardAction, handleCardPayment }
        } = this.props;

        return retrievePaymentIntent(secret).then(
            /** @namespace StripePayments/Component/InjectedStripeCheckoutForm/Container/retrievePaymentIntent/then */
            (result) => {
                const { paymentIntent: { status, confirmation_method } } = result;

                if (['requires_action', 'requires_source_action'].includes(status)) {
                    if (confirmation_method === 'manual') {
                        return handleCardAction(secret).then(
                            /** @namespace StripePayments/Component/InjectedStripeCheckoutForm/Container/handleCardAction/then */
                            (response) => this.handlePostAuthorization(
                                response,
                                savePaymentInformation,
                                paymentInformation
                            )
                        );
                    }

                    return handleCardPayment(secret).then(
                        /** @namespace StripePayments/Component/InjectedStripeCheckoutForm/Container/handleCardPayment/then */
                        (response) => this.handlePostAuthorization(
                            response,
                            savePaymentInformation,
                            paymentInformation
                        )
                    );
                }

                return null;
            }
        );
    }

    /**
    * Submit order information and create token
    * @returns {Promise<{handleAuthorization: InjectedStripeCheckoutForm.handleAuthorization, token: string}|{handleAuthorization: null, token: null}>}
    */
    async submit() {
        const {
            stripe: { createPaymentMethod },
            billingAddress: {
                firstname,
                lastname,
                telephone: phone,
                city,
                country_id: country,
                street,
                region: state
            },
            email,
            elements
        } = this.props;

        const billingName = `${ firstname } ${ lastname }`;
        const cardElement = elements.getElement(CardElement);

        const { paymentMethod } = await createPaymentMethod({
            type: 'card',
            card: cardElement,
            billing_details: {
                name: billingName,
                email,
                phone,
                address: {
                    city,
                    country,
                    line1: street[0],
                    state
                }
            }
        });

        if (!paymentMethod) {
            return { token: null, handleAuthorization: null };
        }

        return {
            token: `${paymentMethod.id}:${paymentMethod.card.brand}:${paymentMethod.card.last4}`,
            handleAuthorization: this.handleAuthorization
        };
    }

    render() {
        return (
            <InjectedStripeCheckoutForm { ...this.containerProps() } />
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(InjectedStripeCheckoutFormContainer);
