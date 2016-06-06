import React from 'react';
import {Link} from 'react-router';

const Home = React.createClass({
  render: function() { 
    return (
      <div className="container centered" style={{maxWidth:'400px',marginTop: '20vh'}}>
        <img className="main-logo" src="img/uPort-logo.svg" alt="uPort" title="uPort Logo" style={{maxWidth:'120px',margin: '20px auto 40px',display: 'block'}} />
        <Link to="connect">
          <button className="btn bigger" type="submit">Connect uPort</button>
        </Link>
        <Link to="sign">
          <button className="btn bigger" type="submit">Sign</button>
        </Link>
      </div>
    );
  }
});

export default Home;