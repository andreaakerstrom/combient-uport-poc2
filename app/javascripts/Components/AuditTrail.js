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
