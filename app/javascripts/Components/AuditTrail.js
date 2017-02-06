/* eslint-env jquery, web3 */
import React from 'react'
import { Link } from 'react-router'
import { Registry } from 'uport-lib'
import { web3 } from '../web3setup.js'

export default class AuditTrail extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      personnummer: null,
    }
  }

  render () {
    let attributesTable = (
      <table style={{color: '#fff'}}>
        <tbody>
          <tr>
            <td style={{textAlign: 'right'}}><strong>uPort Id:</strong></td>
            <td><span id='address' /></td>
          </tr>
          <tr>
            <td style={{textAlign: 'right'}}><strong>Name:</strong></td>
            <td><span id='attributeName' /></td>
          </tr>
          <tr id='attributeDescriptionRow' style={{display: 'none'}}>
            <td style={{textAlign: 'right'}}><strong>I am:</strong></td>
            <td><span id='attributeDescription' /></td>
          </tr>
          <tr id='attributeLocationRow' style={{display: 'none'}}>
            <td style={{textAlign: 'right'}}><strong>Location:</strong></td>
            <td><span id='attributeLocation' /></td>
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
          <form>
            <label style={{margin: '20px 10px 20px 30px'}}>
              <font size="3">Personal number</font>
              <br/>
              <input type="text" name="name" style={{margin: '10px auto auto 30px'}} />
            </label>
            <input type="submit" value="Search" />
          </form>

          <textarea rows="4" cols="50" style={{margin: '20px 10px 20px 30px'}}>
            Audit Trail
          </textarea>

      </div>



    )
  }
}

AuditTrail.propTypes = { web3: React.PropTypes.object }
