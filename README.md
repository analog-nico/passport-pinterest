# Passport-Pinterest

[Passport](https://github.com/jaredhanson/passport) strategy for authenticating with [Pinterest](https://www.pinterest.com) using the OAuth 2.0 API.

[![Build Status](https://img.shields.io/travis/analog-nico/passport-pinterest/master.svg?style=flat-square)](https://travis-ci.org/analog-nico/passport-pinterest)
[![Coverage Status](https://img.shields.io/coveralls/analog-nico/passport-pinterest.svg?style=flat-square)](https://coveralls.io/r/analog-nico/passport-pinterest)
[![Dependency Status](https://img.shields.io/david/analog-nico/passport-pinterest.svg?style=flat-square)](https://david-dm.org/analog-nico/passport-pinterest)

This module lets you authenticate using Pinterest in your Node.js applications. By plugging into Passport, Pinterest authentication can be easily and unobtrusively integrated into any application or framework that supports [Connect](http://www.senchalabs.org/connect/)-style middleware, including [Express](http://expressjs.com/).

## Installation

[![NPM Stats](https://nodei.co/npm/passport-pinterest.png?downloads=true)](https://npmjs.org/package/passport-pinterest)

This is a module for node.js and is installed via npm:

``` bash
npm install passport-pinterest --save
```

## Usage

### Configure Strategy

The Pinterest authentication strategy authenticates users using a Pinterest account and OAuth 2.0 tokens. The strategy requires a `verify` callback, which accepts these credentials and calls `done` providing a user, as well as `options` specifying a client ID, client secret, scope, and callback URL.

``` js
passport.use(new PinterestStrategy({
        clientID: PINTEREST_APP_ID,
        clientSecret: PINTEREST_APP_SECRET,
        scope: ['read_public', 'read_relationships'],
        callbackURL: "https://localhost:3000/auth/pinterest/callback",
        state: true
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ pinterestId: profile.id }, function (err, user) {
            return done(err, user);
        });
    }
));
```

Set the scope parameter according to the [list of available scopes](https://developers.pinterest.com/docs/api/overview/#scopes).

**Pinterest only allows https callback urls.** [This blog article](http://blog.mgechev.com/2014/02/19/create-https-tls-ssl-application-with-express-nodejs/) explains the quickest way to enable https for your Express server.

### Authenticate Requests

Use `passport.authenticate()`, specifying the `'pinterest'` strategy, to authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/) application:

``` js
app.get('/auth/pinterest',
    passport.authenticate('pinterest')
);

app.get('/auth/pinterest/callback', 
    passport.authenticate('pinterest', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    }
);
```

## Contributing

To set up your development environment for Passport-Pinterest:

1. Clone this repo to your desktop,
2. in the shell `cd` to the main folder,
3. hit `npm install`,
4. hit `npm install gulp -g` if you haven't installed gulp globally yet, and
5. run `gulp dev`. (Or run `node ./node_modules/.bin/gulp dev` if you don't want to install gulp globally.)

`gulp dev` watches all source files and if you save some changes it will lint the code and execute all tests. The test coverage report can be viewed from `./coverage/lcov-report/index.html`.

If you want to debug a test you should use `gulp test-without-coverage` to run all tests without obscuring the code by the test coverage instrumentation.

## Change History

- v1.0.0 (2016-10-24)
    - **Breaking Change**: In order to support custom `state` values, the default `state` handling by Passport is not activated by default anymore. Please use `new PinterestStrategy({ state: true, ... })` to get the old behavior.
      *(Thanks to @somprabhsharma for [issue #3](https://github.com/analog-nico/passport-pinterest/issues/3) and [pull request #4](https://github.com/analog-nico/passport-pinterest/pull/4))*
- v0.4.0 (2016-06-08)
    - Allowing to pass custom `options.state` string
      *(Thanks to @cvinson for [pull request #2](https://github.com/analog-nico/passport-pinterest/pull/2))*
    - Improved input validation
    - Added node.js v6 to CI build
    - Updated dependencies
- v0.3.0 (2015-10-30)
    - Changed default session key name from "oauth2:api.pinterest.com" to "oauth2:pinterest" because the dots made saving the session in MongoDB impossible
- v0.2.0 (2015-09-29)
    - Returning profile with more fields
- v0.1.0 (2015-09-28)
    - Verified successfully that the authentication is working
    - No code changes
- v0.0.1 (2015-09-26)
    - Alpha release for people who want to help finding the bug mentioned at the top

## License (ISC)

In case you never heard about the [ISC license](http://en.wikipedia.org/wiki/ISC_license) it is functionally equivalent to the MIT license.

See the [LICENSE file](LICENSE) for details.
