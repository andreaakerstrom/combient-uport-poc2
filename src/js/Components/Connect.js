import React from 'react';
import {Link} from 'react-router';
import web3 from 'web3';
import qs from 'qs';

const registryAddress = '0xa9be82e93628abaac5ab557a9b3b02f711c0151c'
const mappingUrl = 'http://chasqui.uport.me/addr/';
var pollingInterval;

const Connect = React.createClass({
  getInitialState: function() {
    return {
      address: null,
      error: null,
      personaAttributes: null
    };
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
          if(attributes.birthdate != undefined){
            $('#attributeBirthDateRow').show();
            $('#attributeBirthDate').text(attributes.birthdate.substring(0, 10));
          }

          if(attributes.residenceCountry != undefined){
            $('#attributeResidenceCountryRow').show();
            $('#attributeResidenceCountry').text(attributes.residenceCountry);
          }



        }, function(err) {
          $('#attributes').text("There was a problem retrieving your persona details.");
        });
      }

      $('#connect').hide();
      $('#address').text(this.state.address);
      $('#success').show();
    }
    if (this.state.error) {
      clearInterval(pollingInterval)

      $('#connect').hide();
      $('#error').text(this.state.error);
      $('#errorDiv').show();
    }
  },
  connect: function() {
    var self = this;
    this.props.web3.eth.getCoinbase(function(error, address) {
      self.props.web3.eth.defaultAccount = address;
      self.setState({address: address});
    });
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
      <tr id="attributeBirthDateRow" style={{display: 'none'}}>
        <td style={{textAlign: 'right'}}><strong>Birth Date:</strong></td>
        <td><span id="attributeBirthDate"></span></td>
      </tr>
      <tr id="attributeResidenceCountryRow" style={{display: 'none'}}>
        <td style={{textAlign: 'right'}}><strong>Residence Country:</strong></td>
        <td><span id="attributeResidenceCountry"></span></td>
      </tr>

      </tbody>
      </table>
    )

    return (
      <div className="container centered" style={{maxWidth:'480px'}}>
        <Link to="/">
          <img className="main-logo" src="img/uPort-logo.svg" alt="uPort"
            title="uPort Logo"
            style={{maxWidth:'90px',margin: '20px auto 40px',display: 'block'}} />
        </Link>
        <div id="connect">
          <button className="btn bigger" onClick={this.connect} type="submit">Connect uPort</button>
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
