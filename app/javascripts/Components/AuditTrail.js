/* eslint-env jquery, web3 */
import React from 'react'
import { Link } from 'react-router'
import { Registry } from 'uport-lib'
import { web3 } from '../web3setup.js'

export default class AuditTrail extends React.Component {
  constructor (props) {
    super(props)
    this.getAuditTrail = this.getAuditTrail.bind(this)
    this.state = {
      personnummer: null,
      address: null
    }
  }

  componentDidUpdate () {

  /*  var identityfactoryContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"userKey","type":"address"},{"name":"adminKey","type":"address"}],"name":"CreateProxyWithController","outputs":[],"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"creator","type":"address"},{"indexed":false,"name":"proxy","type":"address"},{"indexed":false,"name":"controller","type":"address"}],"name":"IdentityCreated","type":"event"}]);
    var proxyContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"_owner","type":"address"}],"name":"transfer","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"isOwner","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"destination","type":"address"},{"name":"value","type":"uint256"},{"name":"data","type":"bytes"}],"name":"forward","outputs":[],"type":"function"}]);
    var ownerwithadminContract = web3.eth.contract([{"constant":true,"inputs":[],"name":"userKey","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"newUserKey","type":"address"}],"name":"updateUserKey","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"adminKey","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"destination","type":"address"},{"name":"value","type":"uint256"},{"name":"data","type":"bytes"}],"name":"sendTx","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"proxy","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"newAdminKey","type":"address"}],"name":"updateAdminKey","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"type":"function"},{"inputs":[{"name":"proxyAddress","type":"address"},{"name":"_userKey","type":"address"},{"name":"_adminKey","type":"address"}],"type":"constructor"}]);

    var identityFactory = identityfactoryContract.at('0xadb4966858672ef5ed70894030526544f9a5acdd')

    var proxyAddress;
    var controllerAddress;
    var creatorAddress = '0xb3b50f852c35da10181bbda055bd16efd4cccae6';
    var event = identityFactory.IdentityCreated({creator: creatorAddress}, function(error, result) {
            proxyAddress = result.args.proxy;
            controllerAddress = result.args.controller;
        });

    var proxy = proxyContract.at(proxyAddress);
    var controller = ownerwithadminContract.at(controllerAddress);

    console.log('identityFactory: ')
    console.log(proxyAddress)
    console.log(controllerAddress)
*/



   if (this.state.address) {
        const personaRegistry = new Registry({ web3: web3.currentProvider})
        personaRegistry.getPublicProfile(this.state.address).then(profile => {
          console.log(profile)
          $('#attributeName').text(profile.name)
        })
        $('#attributeAddress').text(this.state.address)
        $('#attributePerNbr').text(this.state.personnummer)
        $('#success').show()
        $('#errorDiv').hide()
    } else {
      $('#errorDiv').show()
      $('#success').hide()
    }
  }

  getAuditTrail () {
    let nbr = this.refs.perNbrInput.value
    this.setState({personnummer: nbr})

    if (nbr == '8801182067') {
      this.setState({address: '0xb3b50f852c35da10181bbda055bd16efd4cccae6'})
    } else {
      this.setState({address: null})
    }
  }


  render () {

    let attributesTable = (
      <table>
        <tbody>
        <tr>
          <td><strong>Name: </strong></td>
          <td><span id='attributeName' /></td>
        </tr>
        <tr>
          <td><strong>Personal number: </strong></td>
          <td><span id='attributePerNbr' /></td>
        </tr>
        <tr>
          <td><strong>Uport Id: </strong></td>
          <td><span id='attributeAddress' /></td>
        </tr>
        </tbody>
      </table>
    )

    return (
      <div>
        <nav className="navbar navbar-default">
            <img className='main-logo' src='images/combient-logo.png' alt='uPort'
              title='uPort Logo'
              style={{maxWidth: '90px', margin: '20px'}} />
              <img className='main-logo' src='images/uPort-logo.svg' alt='uPort'
                title='uPort Logo'
                style={{maxWidth: '30px', margin: '10px'}} />
              <img className='main-logo' src='images/seb.jpg' alt='uPort'
                title='uPort Logo'
                style={{maxWidth: '45px', margin: '20px 10px 10px 20px', }} />
        </nav>
        <br/>
        <br/>
        <br/>

        <form action='javascript:void(0);'>
          <label style={{margin: '20px 10px 20px 30px'}}>
            <font size="3">Personal number</font>
            <br/>
            <input type="text" name="name" ref='perNbrInput' defaultValue="8801182067" style={{margin: '10px auto auto 30px'}} />
          </label>
          <button className='btn' onClick={this.getAuditTrail}>Search</button>
        </form>

        <div id='success' style={{display: 'none'}}>
          <table className='persona' style={{margin: '20px 10px 20px 30px'}}>
            <tbody>
              <tr>
                <td>{attributesTable}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div id='errorDiv' style={{display: 'none'}}>
          <h4 style={{margin: '20px 10px 20px 30px'}}>Error! No uPort identity was found.</h4>
        </div>
      </div>
    )
  }
}

AuditTrail.propTypes = { web3: React.PropTypes.object }
