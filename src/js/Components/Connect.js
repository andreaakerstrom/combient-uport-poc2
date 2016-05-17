import React from 'react';
import QRCode from 'qrcode.react';
import {Link} from 'react-router';

//const mappingUrl = 'https://uport-connect-mapping.herokuapp.com/map/';
const mappingUrl = 'http://mapping.uport.me/addr/';
var pollingInterval;

const Connect = React.createClass({
  getInitialState: function() {
    return {
      randomStr: this.randomString(16, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),
      address: null,
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
  },
  componentDidUpdate: function() {
    if (this.state.address) {
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
    return (
      <div className="container centered" style={{maxWidth:'480px'}}>
        <img className="main-logo" src="img/uPort-logo.svg" alt="uPort" title="uPort Logo" style={{maxWidth:'90px',margin: '20px auto 40px',display: 'block'}} />
        <div id="qr">
          <QRCode value={mappingUrl + this.state.randomStr} size={256} />
          <br /><br />
          <p><strong>Value : </strong>{mappingUrl + this.state.randomStr}</p>
        </div>
        <div id="success" style={{display: 'none'}}>
          <h3>Success! You have connected your uPort identity.</h3>
          <p><strong>Address:</strong><span id="address" style={{display: 'inline-block',marginLeft: '10px'}}></span> </p>
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
