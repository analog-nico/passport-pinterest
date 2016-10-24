'use strict';

var isFunction = require('lodash/isFunction'),
    isObjectLike = require('lodash/isObjectLike'),
    isString = require('lodash/isString'),
    isUndefined = require('lodash/isUndefined'),
    util = require('util'),
    OAuth2Strategy = require('passport-oauth').OAuth2Strategy,
    InternalOAuthError = require('passport-oauth').InternalOAuthError;


/**
 * `Strategy` constructor.
 *
 * The Pinterest authentication strategy authenticates requests by delegating
 * to Pinterest using the OAuth 2.0 protocol as described here:
 * https://developers.pinterest.com/docs/api/authentication/
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Pinterest application's app id
 *   - `clientSecret`  your Pinterest application's app secret
 *   - `scope`         see https://developers.pinterest.com/docs/api/overview/#scopes
 *   - `callbackURL`   URL to which Pinterest will redirect the user after granting authorization
 *
 * Examples:
 *
 *     var pinterest = require('passport-pinterest');
 *
 *     passport.use(new pinterest.Strategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret',
 *         scope: ['read_public', 'read_relationships'],
 *         callbackURL: 'https://www.example.net/auth/pinterest/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {

    if (!isObjectLike(options)) {
        throw new TypeError('Please pass the options.');
    }

    if (!isFunction(verify)) {
        throw new TypeError('Please pass the verify callback.');
    }

    function validateStringOption(optionName) {
        if (!isUndefined(options[optionName]) && (!isString(options[optionName]) || options[optionName].length === 0)) {
            throw new TypeError('Please pass a string to options.' + optionName);
        }
    }

    validateStringOption('authorizationURL');
    validateStringOption('tokenURL');
    validateStringOption('scopeSeparator');
    validateStringOption('sessionKey');
    validateStringOption('profileURL');

    options.authorizationURL = options.authorizationURL || 'https://api.pinterest.com/oauth/';
    options.tokenURL = options.tokenURL || 'https://api.pinterest.com/v1/oauth/token';
    options.scopeSeparator = options.scopeSeparator || ',';
    options.sessionKey = options.sessionKey || 'oauth2:pinterest';

    OAuth2Strategy.call(this, options, verify);
    this.name = 'pinterest';
    this._oauth2.useAuthorizationHeaderforGET(true);

    this._profileURL = options.profileURL || 'https://api.pinterest.com/v1/me/?fields=id,username,first_name,last_name,bio,created_at,url,image[30x30,60x60,110x110,165x165,280x280]';

}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);


/**
 * Retrieve user profile from Pinterest.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `pinterest`
 *   - `id`               the user's internal Pinterest ID
 *   - `displayName`      the user's full name
 *   - `url`              the user's profile page url
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {

    var url = this._profileURL;

    this._oauth2.get(url, accessToken, function (err, body, res) {

        if (err) {
            return done(new InternalOAuthError('failed to fetch user profile', err));
        }

        try {

            var json = JSON.parse(body);

            var profile = {
                provider: 'pinterest',
                id: json.data.id,
                username: json.data.username,
                url: json.data.url,
                profileUrl: json.data.url,
                profileImage: json.data.image['60x60'],
                bio: json.data.bio
            };

            var names = [];
            if (json.data.first_name && json.data.first_name !== '') {
                names.push(json.data.first_name);
            }
            if (json.data.last_name && json.data.last_name !== '') {
                names.push(json.data.last_name);
            }
            profile.displayName = names.join(' ');

            profile._raw = body;
            profile._json = json;

            done(null, profile);

        } catch(e) {
            done(e);
        }

    });

};


/**
 * Return extra Pinterest-specific parameters to be included in the
 * authorization request.
 *
 * @param {Object} options
 * @return {Object}
 * @api protected
 */
Strategy.prototype.authorizationParams = function (options) {
    return {};
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
