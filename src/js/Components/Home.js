import React from 'react';
import QRCode from 'qrcode.react';

const Home = React.createClass({
  randomString: function(length,chars){
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  },
  render: function() { 

    var 
      url = 'http://mapping.uport.me/endpoint/',
      rString = this.randomString(16, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),
      qrValue = url + rString;

    return (
      <div className="container centered" style={{maxWidth:'400px'}}>
        <h1>uPort</h1>
        {/*<img className="main-logo" src="img/uPort-logo.svg" alt="uPort" title="uPort Logo" style={{maxWidth:'120px'}} />*/}
        <QRCode value={qrValue} />
        <br /><br />
        <p><strong>Value : </strong>{qrValue}</p>
      </div>
    );
  }
});

export default Home;