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

export const Address = PropTypes.shape({
    city: PropTypes.string,
    company: PropTypes.string,
    country_id: PropTypes.string,
    email: PropTypes.string,
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    postcode: PropTypes.string,
    region_id: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
    region: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string
    ]),
    street: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array
    ]),
    telephone: PropTypes.string
});

export const Stripe = PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func
]);

export const StripeElements = PropTypes.object;

export const PaymentTotals = PropTypes.shape({
    grand_total: PropTypes.number,
    quote_currency_code: PropTypes.string
});

export const PaymentRequest = PropTypes.object;
