import React from 'react'
import '../../sass/uport.scss'
// import Web3 from 'web3'
// import Uport from 'uport-lib'

export default class App extends React.Component {
  // constructor (props) {
  //   super(props)
  // }
  // setUpWeb3 () {
  //   let web3 = new Web3()
  //   let uport = new Uport('TestApp')
  //   let uportProvider = uport.getUportProvider('https://consensysnet.infura.io:8545')
  //   web3.setProvider(uportProvider)
  //   let childrenWithWeb3 = React.cloneElement(this.props.children, { web3: web3 })
  //   return childrenWithWeb3
  // }
  render () {
    // let childrenWithWeb3Render = this.setUpWeb3()
    // let childrenWithWeb3Render = 'hi'
    // return (<div className='connect'>{this.state.childrenWithWeb3}</div>)
    return (<div className='connect'>{this.props.children}</div>)
  }
}

App.propTypes = { children: React.PropTypes.object }
