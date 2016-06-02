import React from 'react';
import QRCode from 'qrcode.react';
import {Link} from 'react-router';
import web3 from 'web3'

//const mappingUrl = 'https://uport-connect-mapping.herokuapp.com/map/';
const mappingUrl = 'http://mapping.uport.me/addr/';
const registryAddress = '0xa9be82e93628abaac5ab557a9b3b02f711c0151c'
var pollingInterval;

const Connect = React.createClass({
  getInitialState: function() {
    return {
      randomStr: this.randomString(16, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),
      address: null,
      error: null,
      personaAttributes: null
    };
  },
  randomString: function(length,chars){
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  },
  checkMappingServer: function() {
    $.ajax({
      url: mappingUrl + this.state.randomStr,
      dataType: 'json',
      cache: false,
      success: function(data) {
        if (typeof(data.address) !== 'undefined') {
          this.setState({address: data.address});
        }
        if (typeof(data.error) !== 'undefined') {
          this.setState({error: data.error});
        }
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(mappingUrl + this.state.randomStr, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function() {
    pollingInterval = setInterval(this.checkMappingServer, 1500);
    setTimeout(function(){
      clearInterval(pollingInterval);
    }, 120000);

    window.uportRegistry.setIpfsProvider({host: 'ipfs.infura.io', port: '5001', protocol: 'https', root: ''});
    window.uportRegistry.setWeb3Provider(new web3.providers.HttpProvider('https://consensysnet.infura.io:8545'));

  },
  componentDidUpdate: function() {

    var that = this;

    if (this.state.address && !this.state.personaAttributes) {
      window.uportRegistry.getAttributes(registryAddress,that.state.address).then(function (attributes){
        that.setState({personaAttributes: attributes});
        $('#attributes').text('Name: ' + that.state.personaAttributes.name);
        console.log(attributes.image[0].contentUrl);
        if(attributes.image[0].contentUrl != undefined){
          var imgUrl="https://ipfs.infura.io"+attributes.image[0].contentUrl
          $('#avatarImg').attr("src",imgUrl);
          $('#avatarDiv').show();
        }
      }, function(err) {
        $('#attributes').text("There was a problem retrieving your persona details.");
      });


      clearInterval(pollingInterval)
      $('#qr').hide();
      $('#address').text(this.state.address);
      $('#success').show();
    }
    if (this.state.error) {
      clearInterval(pollingInterval)
      $('#qr').hide();
      $('#error').text(this.state.error);
      $('#errorDiv').show();
    }
  },
  render: function() {
    var ethUrl="ethereum:me?callback_url=" + mappingUrl + this.state.randomStr
    return (
      <div className="container centered" style={{maxWidth:'480px'}}>
        <img className="main-logo" src="img/uPort-logo.svg" alt="uPort" title="uPort Logo" style={{maxWidth:'90px',margin: '20px auto 40px',display: 'block'}} />
        <div id="qr">
          <a href={ethUrl}><QRCode value={ethUrl} size={256} /></a>
          <br /><br />
          <p><strong>Value : </strong>{ethUrl}</p>
        </div>
        <div id="success" style={{display: 'none'}}>
          <h3>Success! You have connected your uPort identity.</h3>
          <p><strong>Address:</strong><span id="address" style={{display: 'inline-block',marginLeft: '10px'}}></span> </p>
          <p></p>
          <p><span id="attributes" style={{display: 'inline-block',marginLeft: '10px'}}></span></p>
          <div id="avatarDiv" style={{display: 'none'}}>
            <img id="avatarImg" style={{maxWidth: '200px' }}/>
          </div>
          <Link to="sign">
            <button className="btn bigger" type="submit">Continue</button>
          </Link>
        </div>
        <div id="errorDiv" style={{display: 'none'}}>
          <h3>Error! You have NOT connected your uPort identity.</h3>
          <p><strong>Error:</strong><span id="error" style={{display: 'inline-block',marginLeft: '10px'}}></span> </p>
        </div>
      </div>
    );
  }
});

export default Connect;
