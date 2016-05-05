import React from 'react';
import QRCode from 'qrcode.react';

const mappingUrl = 'https://uport-connect-mapping.herokuapp.com/map/';
var pollingInterval;

const Home = React.createClass({
  getInitialState: function() {
    return {
      randomStr: this.randomString(16, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),
      address: null,
    };
  },
  randomString: function(length,chars){
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  },
  checkMappingServer: function() {
    console.log('Checking Server');
    $.ajax({
      url: mappingUrl + this.state.randomStr,
      dataType: 'json',
      cache: false,
      success: function(data) {
        if (typeof(data.address) !== 'undefined') {
          this.setState({address: data.address});
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
    }
  },
  render: function() { 
    return (
      <div className="container centered" style={{maxWidth:'400px'}}>
        <h1>uPort</h1>
        {/*<img className="main-logo" src="img/uPort-logo.svg" alt="uPort" title="uPort Logo" style={{maxWidth:'120px'}} />*/}
        <QRCode value={mappingUrl + this.state.randomStr} size={256} />
        <br /><br />
        <p><strong>Value : </strong>{mappingUrl + this.state.randomStr}</p>
      </div>
    );
  }
});

export default Home;