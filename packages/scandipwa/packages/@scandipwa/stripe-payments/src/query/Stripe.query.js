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

import { Field } from 'Util/Query';

/**
 * Slider Query
 * @class Slider
 * @namespace StripePayments/Query/Stripe/Query/StripeQuery */
export class StripeQuery {
    createPaymentIntent(options) {
        return new Field('createPaymentIntent')
            .addArgument('input', 'CreateIntentInput!', options)
            .addField('intent_client_secret');
    }

    getStripeConfig() {
        return new Field('storeConfig').addFieldList(this._getStripeConfigFields());
    }

    _getStripeConfigFields() {
        return [
            'stripe_mode',
            'stripe_live_pk',
            'stripe_test_pk'
        ];
    }
}

export default new StripeQuery();
