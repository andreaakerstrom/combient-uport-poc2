import React from 'react';
import QRCode from 'qrcode.react';
import {Link} from 'react-router';
import qs from 'qs';

const statusContractAddr='0x60dd15dec1732d6c8a6125b21f77d039821e5b93'
const contractFunction='updateStatus'
const contractFunctionParameter='string%20%22I%27m%20happy%22'
const uri='ethereum:'+statusContractAddr+'?label=uPort%20TestApp&function='+contractFunction+'('+contractFunctionParameter+')';

const mappingUrl = 'http://chasqui.uport.me/tx/';
var pollingInterval;

const Sign = React.createClass({
  getInitialState: function() {
    return {
      randomStr: this.randomString(16, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),
      tx: null,
      error: null,
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
        if (typeof(data.tx) !== 'undefined') {
          this.setState({tx: data.tx});
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
      if (params.tx) {
        clearInterval(pollingInterval);
        this.setState({tx: params.tx})
      }
    }
  },

  componentDidMount: function() {
    window.addEventListener("hashchange", this.locationHashChanged, false);
    pollingInterval = setInterval(this.checkMappingServer, 1500);
    setTimeout(function(){
      clearInterval(pollingInterval);
    }, 120000);

  },

  componentDidUpdate: function() {
    if (this.state.tx) {
      clearInterval(pollingInterval)
      $('#qr').hide();
      $('#tx').text(this.state.tx);
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
    var ethUrl=uri + "&callback_url=" + window.location.href;
    var uriFull=uri+"&callback_url="+mappingUrl + this.state.randomStr;

    return (
      <div className="container centered" style={{maxWidth:'400px'}}>
        <img className="main-logo" src="img/uPort-logo.svg" alt="uPort" title="uPort Logo" style={{maxWidth:'90px',margin: '20px auto 40px',display: 'block'}} />
        Set Status to: <strong>I´m Happy</strong>
        <div id="qr">
          <a href={ethUrl}><QRCode value={uriFull} size={256} /></a>
          <br /><br />
          <div>Please scan this code with your uPortApp.<br/>
          Click on the code if you are on a mobile browser </div>
          <br />
          <div><small>{this.state.randomStr}</small></div>
        </div>
        <div id="success" style={{display: 'none'}}>
          <h3>Success! You have set your status</h3>
          <p><strong>Tx:</strong><span id="tx" style={{display: 'inline-block',marginLeft: '10px'}}></span> </p>
        </div>
        <div id="errorDiv" style={{display: 'none'}}>
          <h3>Error! You have NOT set your status.</h3>
          <p><strong>Error:</strong><span id="error" style={{display: 'inline-block',marginLeft: '10px'}}></span> </p>
        </div>
      </div>
    );
  }
});

export default Sign;
