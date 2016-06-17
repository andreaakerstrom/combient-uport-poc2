import React from 'react';
import QRCode from 'qrcode.react';
import {Link} from 'react-router';
import web3 from 'web3'

const registryAddress = '0xa9be82e93628abaac5ab557a9b3b02f711c0151c'
var pollingInterval;

const Connect = React.createClass({
  getInitialState: function() {
    return {
      address: null,
      personaAttributes: null
    };
  },

  locationHashChanged: function() {
    if(location.hash.startsWith("#access_token")){
      var addr=location.hash.substring(13+1);
      this.setState({address: addr})
    }
  },

  componentDidMount: function() {
    window.uportRegistry.setIpfsProvider(
      {
        host: 'ipfs.infura.io',
        port: '5001',
        protocol: 'https',
        root: ''
      });
    window.uportRegistry.setWeb3Provider(
      new web3.providers.HttpProvider(
        'https://consensysnet.infura.io:8545'
      )
    );

    window.addEventListener("hashchange", this.locationHashChanged, false);

  },
  componentDidUpdate: function() {

    var that = this;

    if (this.state.address && !this.state.personaAttributes) {

      if (window.uportRegistry) {
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
      }

      $('#qr').hide();
      $('#address').text(this.state.address);
      $('#success').show();
    }
    if (this.state.error) {
      $('#qr').hide();
      $('#error').text(this.state.error);
      $('#errorDiv').show();
    }
  },
  render: function() {
    var ethUrl="ethereum:me?callback_url=" + window.location.href;
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
