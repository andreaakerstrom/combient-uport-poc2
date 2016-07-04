import React from 'react';
import QRCode from 'qrcode.react';
import {Link} from 'react-router';
import web3 from 'web3';
import qs from 'qs';

const registryAddress = '0xa9be82e93628abaac5ab557a9b3b02f711c0151c'
const mappingUrl = 'http://chasqui.uport.me/addr/';
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

  locationHashChanged: function() {
    if(location.hash){
      const params = qs.parse(location.hash.slice(1));
      if (params.access_token) {
        clearInterval(pollingInterval);
        this.setState({address: params.access_token})
      }
    }
  },

  componentDidMount: function() {
    window.addEventListener("hashchange", this.locationHashChanged, false);
    pollingInterval = setInterval(this.checkMappingServer, 1500);
    setTimeout(function(){
      clearInterval(pollingInterval);
    }, 120000);

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
  },
  componentDidUpdate: function() {

    var that = this;

    if (this.state.address && !this.state.personaAttributes) {
      clearInterval(pollingInterval)

      if (window.uportRegistry) {
        window.uportRegistry.getAttributes(registryAddress,that.state.address).then(function (attributes){
          that.setState({personaAttributes: attributes});
          $('#attributeName').text(that.state.personaAttributes.name);
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
      clearInterval(pollingInterval)

      $('#qr').hide();
      $('#error').text(this.state.error);
      $('#errorDiv').show();
    }
  },
  render: function() {
    var ethUrl="ethereum:me?label=uPort%20TestApp&callback_url=" + window.location.href;
    var mapUrl="ethereum:me?label=uPort%20TestApp&callback_url="+mappingUrl + this.state.randomStr;

    var attributesTable=(
      <table style={{color: '#fff'}}>
      <tbody>
      <tr>
        <td style={{textAlign: 'right'}}><strong>uPort Id:</strong></td>
        <td><span id="address"></span></td>
      </tr>
      <tr>
        <td style={{textAlign: 'right'}}><strong>Name:</strong></td>
        <td><span id="attributeName"></span></td>
      </tr>
      </tbody>
      </table>
    )

    return (
      <div className="container centered" style={{maxWidth:'480px'}}>
        <img className="main-logo" src="img/uPort-logo.svg" alt="uPort" title="uPort Logo" style={{maxWidth:'90px',margin: '20px auto 40px',display: 'block'}} />
        <div id="qr">
          <a href={ethUrl}><QRCode value={mapUrl} size={256} /></a>
          <br /><br />
          <div>Please scan this code with your uPortApp.<br/>
          Click on the code if you are on a mobile browser </div>
          <br />
          <div><small>{this.state.randomStr}</small></div>
        </div>
        <div id="success" style={{display: 'none'}}>
          <h3>Success! You have connected your uPort identity.</h3>
          <table >
            <tbody>
            <tr>
              <td style={{width: '200px'}}>
                <div id="avatarDiv" style={{display: 'none'}}>
                  <img id="avatarImg" style={{maxWidth: '200px' }}/>
                </div>
              </td>
              <td>
                {attributesTable}

              </td>

            </tr>
            </tbody>
          </table>
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
