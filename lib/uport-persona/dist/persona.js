'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bigi = require('bigi');

var _bigi2 = _interopRequireDefault(_bigi);

var _blockstackProfiles = require('blockstack-profiles');

var bsProfiles = _interopRequireWildcard(_blockstackProfiles);

var _bitcoinjsLib = require('bitcoinjs-lib');

var _bitcoinjsLib2 = _interopRequireDefault(_bitcoinjsLib);

var _uportRegistry = require('uport-registry');

var _uportRegistry2 = _interopRequireDefault(_uportRegistry);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var REGISTRY_ADDRESS = '0xa9be82e93628abaac5ab557a9b3b02f711c0151c';

var matchesAttributeName = function matchesAttributeName(attrName, token) {
  return Object.keys(token.decodedToken.payload.claim)[0] === attrName;
};
var notMatchesAttributeName = function notMatchesAttributeName(attrName, token) {
  return Object.keys(token.decodedToken.payload.claim)[0] !== attrName;
};

/** Class representing a persona. */

var Persona = function () {

  /**
   *  Class constructor.
   *  Creates a new persona object. The registryAddress is an optional argument and if not specified will be set to the default consensys testnet uport-registry.
   *
   *  @memberof Persona
   *  @method          constructor
   *  @param           {String}             address                                                             the address of the persona
   *  @param           {String}             [registryAddress='0xa9be82e93628abaac5ab557a9b3b02f711c0151c']      the uport-registry address to use.
   *  @return          {Object}             self
   */
  function Persona(proxyAddress, registryAddress) {
    _classCallCheck(this, Persona);

    this.address = proxyAddress;
    this.tokenRecords = [];
    if (registryAddress) {
      this.registryAddress = registryAddress;
    } else {
      this.registryAddress = REGISTRY_ADDRESS;
    }
  }

  /**
   *  This functions is used to set providers so that the library can communicate with web3 and ipfs.
   *
   *  @memberof Persona
   *  @method          setProviders
   *  @param           {String}           ipfsProvider           an ipfs provider
   *  @param           {String}           web3Provider           web3 provider
   *  @return          {Void}             No return
   */


  _createClass(Persona, [{
    key: 'setProviders',
    value: function setProviders(ipfsProvider, web3Provider) {
      _uportRegistry2.default.setIpfsProvider(ipfsProvider);
      _uportRegistry2.default.setWeb3Provider(web3Provider);
    }
  }, {
    key: 'loadAttributes',
    value: function loadAttributes() {
      return _uportRegistry2.default.getAttributes(this.registryAddress, this.address);
    }
  }, {
    key: 'saveAttributes',
    value: function saveAttributes() {
      return _uportRegistry2.default.setAttributes(this.registryAddress, this.tokenRecords, { from: this.address });
    }

    /**
     *  This function always have to be called before doing anything else, with the exception of setProfile. This function loads the profile of the persona from the uport-registry into the persona object.
     *
     *  @memberof Persona
     *  @method          load
     *  @return          {Promise<JSON, Error>}            A promise that returns all tokens registered to the persona. Encrypted tokens would be included here. Or an Error if rejected.
     */

  }, {
    key: 'load',
    value: function load() {
      var _this = this;

      return new Promise(function (accept, reject) {
        _this.loadAttributes().then(function (tokens) {
          _this.tokenRecords = tokens;
          accept(tokens);
        }).catch(reject);
      });
    }

    /**
     *  This function sets the profile of the persona. It's intended to be used in the process of creating a new persona. When modifying a persona load should be used in conjunction with the functions below dealing with attributes and claims.
     *
     *  @memberof Persona
     *  @method          setProfile
     *  @param           {JSON}           profile             a profile in JSON, preferably in the format of schema.org/Person.
     *  @param           {String}         privSignKey         the private signing key of the persona
     *  @return          {Promise<JSON, Error>}               A promise that returns tx, or an Error if rejected.
     */
    //  TODO: does this returning promise return a tx id, tx string or tx json?

  }, {
    key: 'setProfile',
    value: function setProfile(profile, privSignKey) {
      var _this2 = this;

      var tokens = Object.keys(profile).map(function (attrName) {
        var attribute = {};
        attribute[attrName] = profile[attrName];

        return _this2.signAttribute(attribute, privSignKey, _this2.address);
      });
      this.tokenRecords = tokens;
      var pubSignKey = Persona.privateKeyToPublicKey(privSignKey);
      this.tokenRecords.push(this.signAttribute({ "pubSignKey": pubSignKey }, privSignKey, this.address));
      return this.saveAttributes();
    }

    /**
     *  This function returns a profile in JSON format.
     *
     *  @memberof Persona
     *  @method          getProfile
     *  @return          {JSON}           profile
     */

  }, {
    key: 'getProfile',
    value: function getProfile() {
      // When encryption is implemented this will only give
      // you the part of the profile you have access to.
      var profile = {};

      this.tokenRecords.map(function (tokenRecord) {
        var decodedToken = null;
        try {
          decodedToken = bsProfiles.verifyTokenRecord(tokenRecord, tokenRecord.decodedToken.payload.issuer.publicKey);
        } catch (e) {
          throw new Error('decodedToken failed: ' + e);
        }

        if (decodedToken !== null) {
          profile = Object.assign({}, profile, decodedToken.payload.claim);
        }
      });
      return profile;
    }

    /**
     *  Returns the public signing key of the persona.
     *
     *  @memberof Persona
     *  @method          getPublicSigningKey
     *  @return          {String}
     */
    //  TODO: are these keys strings?

  }, {
    key: 'getPublicSigningKey',
    value: function getPublicSigningKey() {
      return this.getClaims('pubSignKey')[0].decodedToken.payload.claim.pubSignKey;
    }

    /**
     *  Returns the public encryption key of the persona, if set.
     *
     *  @memberof Persona
     *  @method          getPublicEncryptionKey
     *  @return          {String}
     */

  }, {
    key: 'getPublicEncryptionKey',
    value: function getPublicEncryptionKey() {
      return this.getClaims('pubEncKey')[0].decodedToken.payload.claim.pubEncKey;
    }

    /**
     *  Returns all tokens associated with the persona.
     *
     *  @memberof Persona
     *  @method          getAllClaims
     *  @return          {JSON}           List of tokens
     */

  }, {
    key: 'getAllClaims',
    value: function getAllClaims() {
      return this.tokenRecords;
    }

    /**
     *  Returns all tokens that have the given attribute name.
     *
     *  @memberof Persona
     *  @method          getClaims
     *  @param           {String}         attributesName         the name of the attribute to check
     *  @return          {JSON}           List of tokens
     */

  }, {
    key: 'getClaims',
    value: function getClaims(attributeName) {
      return this.tokenRecords.filter(matchesAttributeName.bind(undefined, attributeName));
    }

    /**
     *  Add a signed claim to this persona. This should be used to add tokens signed by third parties.
     *
     *  @memberof Persona
     *  @method          addClaim
     *  @param           {JSON}                     token          the claim to add
     *  @return          {Promise<None, Error>}     A promise that does not return, or an Error if rejected.
     */
    //  TODO: is the token json?

  }, {
    key: 'addClaim',
    value: function addClaim(token) {
      if (!Persona.isTokenValid(token)) {
        return Promise.reject("Token containing claim is invalid, and thus not added.");
      }

      this.tokenRecords.push(token);
      return _uportRegistry2.default.setAttributes(this.registryAddress, this.tokenRecords, { from: this.address });
    }

    /**
     *  Adds a self signed attribute to the persona. Only to be used if you can send transactions as persona.address.
     *
     *  @memberof Persona
     *  @method          addAttribute
     *  @param           {Object}                     attribute          the attribute to add, in the format {attrName: attr}
     *  @param           {String}                     privSignKey        the private signing key of the persona
     *  @return          {Promise<None, Error>}       A promise that does not return, or an Error if rejected.
     */

  }, {
    key: 'addAttribute',
    value: function addAttribute(attribute, privSignKey) {
      var token = this.signAttribute(attribute, privSignKey, this.address);
      return this.addClaim(token);
    }

    /**
     *  Removes all tokens having the same attribute name as the given attribute and adds the given attribute. Only to be used if you can send transactions as persona.address.
     *
     *  @memberof Persona
     *  @method          placeAttribute
     *  @param           {Object}                     attribute          the attribute to add, in the format {attrName: attr}
     *  @param           {String}                     privSignKey        the private signing key of the persona
     *  @return          {Promise<None, Error>}       A promise that does not return, or an Error if rejected.
     */

  }, {
    key: 'replaceAttribute',
    value: function replaceAttribute(attribute, privSignKey) {
      var attributeName = Object.keys(attribute)[0];
      this.tokenRecords = this.tokenRecords.filter(notMatchesAttributeName.bind(undefined, attributeName));
      return this.addAttribute(attribute, privSignKey);
    }

    /**
     *  Removes all attributes with the same attribute name as the given attribute. Only to be used if you can send transactions as persona.address.
     *
     *  @memberof Persona
     *  @method          deleteAttribute
     *  @param           {Object}                     attribute          the attribute to add, in the format {attrName: attr}
     *  @return          {Promise<None, Error>}       A promise that does not return, or an Error if rejected.
     */

  }, {
    key: 'deleteAttribute',
    value: function deleteAttribute(attributeName) {
      this.tokenRecords = this.tokenRecords.filter(notMatchesAttributeName.bind(undefined, attributeName));
      return this.saveAttributes();
    }

    /**
     *  Signs the given attribute to the persona. This method is to be used by third parties who wishes to attest to an attribute of the persona.
     *
     *  @memberof Persona
     *  @method          signAttribute
     *  @param           {Object}           attribute          the attribute to add, in the format {attrName: attr}
     *  @param           {String}           privSignKey        the private signing key of the attestor
     *  @param           {String}           issuerId           the address of the attestor (voluntary, to allow finding info on the attestor from uport-registry)
     *  @return          {Object}           token
     */

  }, {
    key: 'signAttribute',
    value: function signAttribute(attribute, privSignKey, issuerId) {
      var issuerPublicKey = Persona.privateKeyToPublicKey(privSignKey);

      var issuer = {};
      issuer.publicKey = issuerPublicKey;
      if (issuerId !== undefined) {
        issuer.uportId = issuerId;
      }
      var subject = { uportId: this.address };
      subject.publicKey = 'Public key can be read from pubSignKey record.';
      var rawToken = bsProfiles.signToken(attribute, privSignKey, subject, issuer);

      return bsProfiles.wrapToken(rawToken);
    }

    /**
     *  Same as addAttribute but for a list of attributes.
     *
     *  @memberof Persona
     *  @method          signMultipleAttributes
     *  @param           {Array}                  attribute          the attribute to add, in the format [{attrName: attr},...]
     *  @param           {String}                 privSignKey        the private signing key of the attestor
     *  @param           {String}                 issuerId           the address of the attestor (voluntary, to allow finding info on the attestor from uport-registry)
     *  @return          {Array}                  List of tokens
     */

  }, {
    key: 'signMultipleAttributes',
    value: function signMultipleAttributes(attributes, privSignKey, issuerId) {
      return attributes.map(function (attribute) {
        return bsProfiles.signAttribute(attribute, privSignKey, issuerId);
      });
    }

    /**
     *  A static function for checking if a token is valid.
     *
     *  @memberof Persona
     *  @method          isTokenValid
     *  @param           {Object}           token
     *  @return          {Boolean}
     */

  }], [{
    key: 'isTokenValid',
    value: function isTokenValid(token) {
      try {
        bsProfiles.verifyTokenRecord(token, token.decodedToken.payload.issuer.publicKey);
      } catch (e) {
        // console.log(e);
        return false;
      }
      return true;
    }

    /**
     *  A static function for checking if a token is valid.
     *
     *  @memberof Persona
     *  @method          privateKeyToPublicKey
     *  @param           {String}                 privateKey
     *  @return          {String}                 publicKey
     */

  }, {
    key: 'privateKeyToPublicKey',
    value: function privateKeyToPublicKey(privateKey) {
      var privateKeyBigInteger = _bigi2.default.fromBuffer(new Buffer(privateKey, 'hex'));
      var ellipticKeyPair = new _bitcoinjsLib2.default.ECPair(privateKeyBigInteger, null, {});
      var publicKey = ellipticKeyPair.getPublicKeyBuffer().toString('hex');

      return publicKey;
    }
  }]);

  return Persona;
}();

//export default Persona;


module.exports = Persona;