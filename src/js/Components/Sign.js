import React from 'react';
import QRCode from 'qrcode.react';
import {Link} from 'react-router';

const uri='ethereum:0x60dd15dec1732d6c8a6125b21f77d039821e5b93?function=updateStatus(string%20%22I%27m%20happy%22)';


const Sign = React.createClass({
  render: function() {
    return (
      <div className="container centered" style={{maxWidth:'400px',marginTop: '20vh'}}>
        <img className="main-logo" src="img/uPort-logo.svg" alt="uPort" title="uPort Logo" style={{maxWidth:'90px',margin: '20px auto 40px',display: 'block'}} />
        Set Status to: <strong>I´m Happy</strong>
        <div id="qr">
          <QRCode value={uri} size={256} />
          <br /><br />
          <p><strong>Value : </strong>{uri}</p>
        </div>

      </div>
    );
  }
});

export default Sign;
