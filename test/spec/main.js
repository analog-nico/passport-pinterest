/* jshint nonew:false */
'use strict';

var PinterestStrategy = require('../../').Strategy;


describe('Passport-Pinterest', function () {

    it('should initialize', function () {

        expect(function () {

            new PinterestStrategy();

        }).to.throw('Please pass the options.');

        expect(function () {

            new PinterestStrategy({});

        }).to.throw('Please pass the verify callback.');

        expect(function () {

            new PinterestStrategy({}, function () {});

        }).to.throw();

        expect(function () {

            new PinterestStrategy({
                clientID: '1234'
            }, function () {});

        }).not.to.throw();

        expect(function () {

            new PinterestStrategy({
                clientID: '1234',
                state: 'abcd'
            }, function () {});

        }).not.to.throw();

        expect(function () {

            new PinterestStrategy({
                clientID: '1234',
                authorizationURL: false
            }, function () {});

        }).to.throw('Please pass a string to options.authorizationURL');

        expect(function () {

            new PinterestStrategy({
                clientID: '1234',
                tokenURL: false
            }, function () {});

        }).to.throw('Please pass a string to options.tokenURL');

        expect(function () {

            new PinterestStrategy({
                clientID: '1234',
                scopeSeparator: false
            }, function () {});

        }).to.throw('Please pass a string to options.scopeSeparator');

        expect(function () {

            new PinterestStrategy({
                clientID: '1234',
                sessionKey: false
            }, function () {});

        }).to.throw('Please pass a string to options.sessionKey');

        expect(function () {

            new PinterestStrategy({
                clientID: '1234',
                profileURL: false
            }, function () {});

        }).to.throw('Please pass a string to options.profileURL');

    });

});
