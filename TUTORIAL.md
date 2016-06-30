# uPort TestApp
uPort TestApp is a sample test dApp (decentralized app) which purpose is to demo the features of uPort Connect. uPort Connect is a system that enables a dApp to integrate uPort for user identification (login in the future) and for off-dapp signing. Right now it only works with uPort Iphone App.


## uPort Connect Sequence
uPort connect allows a dApp to get the uPort data from the user. The uPort address is stored on the uportMobile, with that address the dApp can query the uPort attributes from the blockchain and IPFS.

This sequence diagram shows how the testDapp, uportMobile and mapping server interact

![Uport Connect](diagrams/img/uport-connect.png)

### Get address from user
The dapp issues a GET call to the mapping server with a random number generated in the dapp and publish that URL in a QR code so the uPortMobile app can scan it, and POST the address of the user to the mapping server so the dapp que retrieve it.

In the testDapp this looks like this:

In _src/js/Components/Connect.js_
```
const mappingUrl = 'http://chasqui.uport.me/addr/';
randomStr: this.randomString(16, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),

...

$.ajax({
  url: mappingUrl + this.state.randomStr,
  dataType: 'json',
  cache: false,
  success: function(data) {
    if (typeof(data.address) !== 'undefined') {
      this.setState({address: data.address});
    }
    if (typeof(data.error) !== 'undefined') {
      this.setState({error: data.error});
    }
  }.bind(this),
  error: function(xhr, status, err) {
    console.error(mappingUrl + this.state.randomStr, status, err.toString());
  }.bind(this)
});
```

This will query the `mappingUrl` for the address. It will not return any address until the uPortMobile POST one the the URL.

After the address is received it can be used to query the uPort attributes (the address is the uPort identifier)

In _src/js/Components/Connect.js_
```
//Set up uport for usage with Infura.
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

//Get attributes from uPort
window.uportRegistry.getAttributes(registryAddress,that.state.address)
.then(function (attributes){
  that.setState({personaAttributes: attributes});
  $('#attributes').text('Name: ' + that.state.personaAttributes.name);

  if(attributes.image[0].contentUrl != undefined){
    var imgUrl="https://ipfs.infura.io"+attributes.image[0].contentUrl
    $('#avatarImg').attr("src",imgUrl);
    $('#avatarDiv').show();
  }
}, function(err) {
  $('#attributes').text("There was a problem retrieving your persona details.");
});


```

### Request an contract invocation.
When the dApp needs that the user invoke a contract function, it creates a QR code with the parameters so the uPortMobile can create, sign and broadcast the transaction. Here the mapping server is also used so the dApp can get the tx hash and query if (and when) it is mined

In the testapp looks like this.

In _src/js/Components/Sign|.js_
```
const statusContractAddr='0x60dd15dec1732d6c8a6125b21f77d039821e5b93'
const contractFunction='updateStatus'
const contractFunctionParameter='string%20%22I%27m%20happy%22'
const uri='ethereum:'+statusContractAddr+'?function='+contractFunction+'('+contractFunctionParameter+')';

const mappingUrl = 'http://chasqui.uport.me/tx/';

randomStr: this.randomString(16, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),

...

$.ajax({
  url: mappingUrl + this.state.randomStr,
  dataType: 'json',
  cache: false,
  success: function(data) {
    if (typeof(data.tx) !== 'undefined') {
      this.setState({tx: data.tx});
    }
    if (typeof(data.error) !== 'undefined') {
      this.setState({error: data.error});
    }
  }.bind(this),
  error: function(xhr, status, err) {
    console.error(mappingUrl + this.state.randomStr, status, err.toString());
  }.bind(this)
});


...

var uriFull=uri+"&callback_url="+mappingUrl + this.state.randomStr;

...

<div id="qr">
  <a href={uriFull}><QRCode value={uriFull} size={256} /></a>
  <br /><br />
  <p><strong>Value : </strong>{uriFull}</p>
</div>

```
