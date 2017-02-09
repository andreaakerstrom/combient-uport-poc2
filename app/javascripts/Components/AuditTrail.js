/* eslint-env jquery, web3 */
import React from 'react'
import { Link } from 'react-router'
import { Registry } from 'uport-lib'
import { web3 } from '../web3setup.js'
var UportRegistry = require('uport-registry')

export default class AuditTrail extends React.Component {
  constructor (props) {
    super(props)

    let registry = new UportRegistry()

    this.connect = this.connect.bind(this)
    this.getAuditTrail = this.getAuditTrail.bind(this)
    this.addNewClaim = this.addNewClaim.bind(this)

    this.state = {
      registry: registry,
      connect: false,
      connectPerNb:null,
      connectAdress: null,
      connectPersonaAttributes: null,
      connectError: null,
      getLog: false,
      logPerNbr: null,
      logAdress: null,
      addClaim: false,
      claimTx: null,
      claimStatus: null,
      claimError: null
    }
  }

  componentDidUpdate () {
    let self = this

   if (this.state.connect) {
     if (this.state.connectAdress && !this.state.connectPersonaAttributes) {

       const personaRegistry = new Registry({ web3: web3.currentProvider})
       personaRegistry.getPublicProfile(this.state.connectAdress).then(profile => {
         console.log(profile)
         self.setState({ connectPersonaAttributes: profile })
         $('#attributeName').text(profile.name)
       }).catch(function(e) {
          console.log(e)
          self.setState({connectError: e})
        })

       $('#connect').hide()
       $('#claim').show()
       $('#attributeConnectAdress').text(this.state.connectAdress)
       $('#connectSuccess').show()
       $('#connectErrorDiv').hide()
     }
     if (this.state.connectError) {
       $('#connect').hide()
       $('#claim').hide()
       $('#connectSuccess').hide()
       $('#connectError').text(this.state.connectError)
       $('#connectErrorDiv').show()
     }


   } else if (this.state.addClaim) {
     if (this.state.claimTx) {
       $('#claimTx').text(this.state.claimTx)
       $('#ClaimSuccess').show()
     }
     if (this.state.claimError) {
       $('#claimError').text(this.state.claimError)
       $('#claimErrorDiv').show()
     }
   } else if (this.state.getLog) {
      if (this.state.logAdress) {
           const personaRegistry = new Registry({ web3: web3.currentProvider})
           personaRegistry.getPublicProfile(this.state.logAdress).then(profile => {
             console.log(profile)
             $('#attributeLogName').text(profile.name)
           })
           $('#attributeLogAdress').text(this.state.logAdress)
           $('#attributeLogPerNbr').text(this.state.logPerNbr)
           $('#logSuccess').show()
           $('#logErrorDiv').hide()
       } else {
         $('#logErrorDiv').show()
         $('#logSuccess').hide()
       }
    }
  }

  connect () {
    let self = this
    web3.eth.getCoinbase(function (error, address) {
      if (error) {
        self.setState({connectError: error})
      } else {
      web3.eth.defaultAccount = address
      self.setState({connectAdress: address})
    }})
    self.setState({getLog: false})
    self.setState({connect: true})
  }

  addNewClaim () {
    let self = this
    let claimType = this.refs.claimTypeInput.value
    let claimValue = this.refs.claimValueInput.value

  /*  var attributes = {
      "@context": "http://schema.org",
      "@type": claimType,
      "value": claimValue
    }
*/
   this.setState({claimStatus: 'Mining in progress.'})
    var attributes = {
      "@context": "http://schema.org",
      "@type": "Person",
      "name": "Dea"
    }

    this.state.registry.setAttributes(attributes, function (err, txHash) {
      if (err) {
        self.setState({claimError: err})
        this.setState({claimStatus: null})
      }
      console.log('Attributes set.')

      self.setState({claimTx: txHash})
      self.waitForMined(txHash, {blockNumber: null})
    })
  }

  waitForMined (txHash, res) {
    let self = this
    if (res.blockNumber) {
      /*self.state.status.getStatus.call(web3.eth.defaultAccount, function (e, r) {
      })*/
      this.setState({claimStatus: null})
    } else {
      console.log('not mined yet.')
      // check again in one sec.
      setTimeout(function () {
        web3.eth.getTransaction(txHash, function (e, r) {
          self.waitForMined(txHash, r)
        })
      }, 1000)
    }
  }

    getAuditTrail () {
      let self = this
      let nbr = this.refs.logPerNbrInput.value
      self.setState({logPerNbr: nbr})

      if (nbr == '8801182067') {
        self.setState({logAdress: '0xb3b50f852c35da10181bbda055bd16efd4cccae6'})
      } else {
        self.setState({logAdress: null})
      }
      self.setState({getLog: true})
      self.setState({connect: false})
    }

  render () {

    let connectAttributesTable = (
      <table>
        <tbody>
          <tr>
            <td style={{textAlign: 'left'}}><strong>uPort Id:</strong></td>
            <td><span id='attributeConnectAdress' /></td>
          </tr>
          <tr>
            <td style={{textAlign: 'left'}}><strong>Name:</strong></td>
            <td><span id='attributeConnectName' /></td>
          </tr>
        </tbody>
      </table>
    )

    let logAttributesTable = (
      <table>
        <tbody>
        <tr>
          <td><strong>Name: </strong></td>
          <td><span id='attributeLogName' /></td>
        </tr>
        <tr>
          <td><strong>Personal number: </strong></td>
          <td><span id='attributeLogPerNbr' /></td>
        </tr>
        <tr>
          <td><strong>Uport Id: </strong></td>
          <td><span id='attributeLogAdress' /></td>
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

        <section>
            <section style={{width: '50%', float: 'left'}}>
            <div className='container centered' style={{maxWidth: '480px',margin: '20px 10px 40px 50px'}}>

              <div id='connect'>
               <h3>Add claim</h3>
                <button className='btn bigger' onClick={this.connect} type='submit'>Connect uPort</button>
              </div>
              <div id='connectSuccess' style={{display: 'none'}}>
                <h3>Success! You have connected your uPort identity.</h3>
                <table className='persona'>
                  <tbody>
                    <tr>
                      <td>{connectAttributesTable}</td>
                    </tr>
                  </tbody>
                </table>
                <br/>
              </div>
              <div id='connectErrorDiv' style={{display: 'none'}}>
                <h3>Error! You have NOT connected your uPort identity.</h3>
                <p><strong></strong><span id='connectError' style={{display: 'inline-block'}} /> </p>
              </div>


              <div id='claim' style={{display: 'none'}}>
                <h3>Add claim</h3>
                      <label>Claim type: </label>
                      <input type='text' ref='claimTypeInput' defaultValue='Personnummer' />
                      <br/>
                      <br/>
                      <label>Claim value: </label>
                      <input type='text' ref='claimValueInput' defaultValue='8801182067' />
                    <br/>
                    <br/>
                      <button className='btn' onClick={this.addNewClaim}>Add</button>
              </div>
              <div id='claimMining'>
                <h3 id='claimStatus'>{this.state.claimStatus}</h3>
              </div>
              <div id='claimSuccess' style={{display: 'none'}}>
                <h3>Success! You have added a claim with Tx: </h3>
                <p><strong></strong><span id='claimTx' style={{display: 'inline-block'}} /></p>
              </div>
              <div id='claimErrorDiv' style={{display: 'none'}}>
                <h3>Error! You have NOT added a claim.</h3>
                <p><strong></strong><span id='claimError' style={{display: 'inline-block'}} /></p>
              </div>
            </div>
        </section>

        <section style={{width: '50%', float: 'right'}}>
              <label>
               <h3>Personal number</h3>
                <input type="text" ref='logPerNbrInput' defaultValue="8801182067"/>
              </label>
              <button className='btn' onClick={this.getAuditTrail}>Search</button>

            <div id='logSuccess' style={{display: 'none'}}>
            <br/>
              <table className='persona'>
                <tbody>
                  <tr>
                    <td>{logAttributesTable}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div id='logErrorDiv' style={{display: 'none'}}>
              <h4>No uPort identity was found.</h4>
            </div>
            </section>
        </section>

      </div>
    )
  }
}

AuditTrail.propTypes = { web3: React.PropTypes.object }
