const { expectEvent, expectRevert } = require("@openzeppelin/test-helpers");
const { should } = require("chai").should();

const {
  deployProxy,
  upgradeProxy,
  erc1967,
} = require("@openzeppelin/truffle-upgrades");
const CMTAT1 = artifacts.require("CMTATV1");
const CMTAT2 = artifacts.require("CMTAT");

contract("UpgradeableCMTAT - Proxy", function ([_, owner, address1]) {
  it("should increment the balance value", async function () {
    // With the first version of CMTAT
    this.upgradeableCMTATInstance = await deployProxy(
      CMTAT1,
      [owner, _, "CMTA Token", "CMTAT", "CMTAT_ISIN", "https://cmta.ch"],
      { initializer: "initialize", constructorArgs: [] }
    );
    (
      await this.upgradeableCMTATInstance.balanceOf(owner)
    ).should.be.bignumber.equal("0");
    const implementationContractAddress1 = erc1967.getImplementationAddress(
      this.upgradeableCMTATInstance.address,
      {
        from: owner,
      }
    );

    // Issue 20 and check balances and total supply
    ({ logs: this.logs1 } = await this.upgradeableCMTATInstance.mint(
      address1,
      20,
      {
        from: owner,
      }
    ));
    (
      await this.upgradeableCMTATInstance.balanceOf(address1)
    ).should.be.bignumber.equal("20");
    (
      await this.upgradeableCMTATInstance.totalSupply()
    ).should.be.bignumber.equal("20");

    // With the new version
    // With the first version of CMTAT
    this.upgradeableCMTATV2Instance = await upgradeProxy(
      this.upgradeableCMTATInstance.address,
      CMTAT2,
      { constructorArgs: [] }
    );
    // Get the new implementation contract address
    const implementationContractAddress2 = erc1967.getImplementationAddress(
      this.upgradeableCMTATInstance.address,
      {
        from: owner,
      }
    );
    // The address of the implementation contract has changed
    implementationContractAddress1.should.not.be.equal(
      implementationContractAddress2
    );

    (
      await this.upgradeableCMTATV2Instance.balanceOf(address1)
    ).should.be.bignumber.equal("20");

    // Issue 20 and check balances and total supply
    ({ logs: this.logs1 } = await this.upgradeableCMTATV2Instance.mint(
      address1,
      20,
      {
        from: owner,
      }
    ));
    (
      await this.upgradeableCMTATV2Instance.balanceOf(address1)
    ).should.be.bignumber.equal("40");
    (
      await this.upgradeableCMTATV2Instance.totalSupply()
    ).should.be.bignumber.equal("40");
  });
  
  /*it("should increment the balance value", async function () {
    const rawContract =
   "0x608060405260006101cc5534801561001657600080fd5b5061370d806100266000396000f3fe608060405234801561001057600080fd5b50600436106102f15760003560e01c806379cc67901161019d578063d26c93e7116100e9578063dcfd616f116100a2578063e63ab1e91161007c578063e63ab1e9146106df578063e85b3ec5146106f4578063fb78ed4014610707578063fcf196b41461071c57600080fd5b8063dcfd616f14610680578063dd62ed3e14610693578063e20c35e5146106cc57600080fd5b8063d26c93e714610605578063d4ce141514610618578063d50256251461062b578063d539139314610633578063d547741f1461065a578063da7422281461066d57600080fd5b8063a217fddf11610156578063a4a0a30111610130578063a4a0a3011461059f578063a9059cbb146105b2578063d0516650146105c5578063d21268ef146105f257600080fd5b8063a217fddf14610571578063a312e15514610579578063a457c2d71461058c57600080fd5b806379cc6790146105155780637f4ab1dd146105285780638456cb591461053b5780638d1fdf2f1461054357806391d148541461055657806395d89b411461056957600080fd5b8063395093511161025c578063572b6c0511610215578063634daf76116101ef578063634daf76146104b15780636439fd75146104c457806370a08231146104d957806378f86afc1461050257600080fd5b8063572b6c05146104705780635c975abb146104935780635ee7a9421461049e57600080fd5b806339509351146104145780633f4ba83a1461042757806340c10f191461042f57806341c0e1b514610442578063426a84931461044a57806345c8b1a61461045d57600080fd5b8063246b72ec116102ae578063246b72ec14610373578063248a9ca314610388578063282c51f3146103ab5780632f2ff15d146103d2578063313ce567146103e757806336568abe1461040157600080fd5b806301ffc9a7146102f657806306fdde031461031e578063095ea7b31461033357806317d70f7c1461034657806318160ddd1461034e57806323b872dd14610360575b600080fd5b6103096103043660046131ea565b610748565b60405190151581526020015b60405180910390f35b61032661077f565b60405161031591906133ed565b61030961034136600461312f565b610811565b61032661082e565b6035545b604051908152602001610315565b61030961036e366004613085565b6108bc565b61035260008051602061369883398151915281565b6103526103963660046131ae565b600090815260cc602052604090206001015490565b6103527f3c11d16cbaffd01df69ce1c404f6340ee057498f5f00246190ea54220576a84881565b6103e56103e03660046131c6565b6108d3565b005b6103ef610905565b60405160ff9091168152602001610315565b6103e561040f3660046131c6565b610918565b61030961042236600461312f565b6109ab565b6103e56109ff565b6103e561043d36600461312f565b610a25565b6103e5610aa4565b61030961045836600461315a565b610ac5565b61030961046b366004612f69565b610b6c565b61030961047e366004612f69565b610196546001600160a01b0391821691161490565b60fe5460ff16610309565b6103526104ac3660046131ae565b610b9b565b6103526104bf3660046131c6565b610bc7565b6103526000805160206136b883398151915281565b6103526104e7366004612f69565b6001600160a01b031660009081526033602052604090205490565b6103e5610510366004613212565b610c21565b6103e561052336600461312f565b610c42565b6103266105363660046132d0565b610d42565b6103e5610e0e565b610309610551366004612f69565b610e31565b6103096105643660046131c6565b610e57565b610326610e82565b610352600081565b6103526105873660046131ae565b610e91565b61030961059a36600461312f565b610eb7565b6103e56105ad366004612f69565b610f6e565b6103096105c036600461312f565b610fc8565b6103096105d3366004612f69565b6001600160a01b03166000908152610130602052604090205460ff1690565b6103526106003660046132af565b610fdc565b6103e5610613366004612fbd565b611003565b6103ef610626366004613085565b611083565b6103266110f6565b6103527f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a681565b6103e56106683660046131c6565b611103565b6103e561067b366004612f69565b61112b565b6103e561068e366004613212565b61115d565b6103526106a1366004612f85565b6001600160a01b03918216600090815260346020908152604080832093909416825291909152205490565b6103526106da3660046131ae565b61117e565b61035260008051602061367883398151915281565b6103e56107023660046130c5565b6111a4565b61070f6111d2565b60405161031591906133a9565b61016354610730906001600160a01b031681565b6040516001600160a01b039091168152602001610315565b60006001600160e01b03198216637965db0b60e01b148061077957506301ffc9a760e01b6001600160e01b03198316145b92915050565b60606036805461078e906135ad565b80601f01602080910402602001604051908101604052809291908181526020018280546107ba906135ad565b80156108075780601f106107dc57610100808354040283529160200191610807565b820191906000526020600020905b8154815290600101906020018083116107ea57829003601f168201915b5050505050905090565b600061082561081e61122a565b8484611234565b50600192915050565b6066805461083b906135ad565b80601f0160208091040260200160405190810160405280929190818152602001828054610867906135ad565b80156108b45780601f10610889576101008083540402835291602001916108b4565b820191906000526020600020905b81548152906001019060200180831161089757829003601f168201915b505050505081565b60006108c9848484611359565b90505b9392505050565b600082815260cc60205260409020600101546108f6816108f161122a565b6113d0565b6109008383611434565b505050565b600061091360655460ff1690565b905090565b61092061122a565b6001600160a01b0316816001600160a01b03161461099d5760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084015b60405180910390fd5b6109a782826114bb565b5050565b60006108256109b861122a565b8484603460006109c661122a565b6001600160a01b03908116825260208083019390935260409182016000908120918b16815292529020546109fa9190613508565b611234565b600080516020613678833981519152610a1a816108f161122a565b610a22611540565b50565b7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6610a52816108f161122a565b610a5c83836115d9565b826001600160a01b03167f0f6798a560793a54c3bcfe86a93cde1e73087d944c0ea20544137d412139688583604051610a9791815260200190565b60405180910390a2505050565b6000610ab2816108f161122a565b610aba61122a565b6001600160a01b0316ff5b600081610afc610ad361122a565b6001600160a01b039081166000908152603460209081526040808320938a168352929052205490565b14610b575760405162461bcd60e51b815260206004820152602560248201527f434d5441543a2063757272656e7420616c6c6f77616e6365206973206e6f74206044820152641c9a59da1d60da1b6064820152608401610994565b610b618484610811565b506001949350505050565b60006000805160206136b8833981519152610b89816108f161122a565b610b92836116c4565b91505b50919050565b6000806000610bac846101ca611753565b9150915081610bbd57603554610bbf565b805b949350505050565b6001600160a01b03811660009081526101c96020526040812081908190610bef908690611753565b9150915081610c16576001600160a01b038416600090815260336020526040902054610c18565b805b95945050505050565b6000610c2f816108f161122a565b8151610900906067906020850190612e74565b7f3c11d16cbaffd01df69ce1c404f6340ee057498f5f00246190ea54220576a848610c6f816108f161122a565b6000610c7d846106a161122a565b905082811015610cdb5760405162461bcd60e51b8152602060048201526024808201527f434d5441543a206275726e20616d6f756e74206578636565647320616c6c6f77604482015263616e636560e01b6064820152608401610994565b610cef84610ce761122a565b858403611234565b610cf984846117b7565b836001600160a01b03167fcc16f5dbb4873280815c1ee09dbd06736cffcc184412cf7a71a0fdb75d397ca584604051610d3491815260200190565b60405180910390a250505050565b606060ff8216610d7657505060408051808201909152600e81526d2737903932b9ba3934b1ba34b7b760911b602082015290565b60ff821660011415610db2575050604080518082019091526014815273105b1b081d1c985b9cd9995c9cc81c185d5cd95960621b602082015290565b60ff821660021415610dee575050604080518082019091526014815273105b1b081d1c985b9cd9995c9cc81c185d5cd95960621b602082015290565b610163546001600160a01b031615610e095761077982611909565b919050565b600080516020613678833981519152610e29816108f161122a565b610a2261198d565b60006000805160206136b8833981519152610e4e816108f161122a565b610b9283611a09565b600091825260cc602090815260408084206001600160a01b0393909316845291905290205460ff1690565b60606037805461078e906135ad565b6000600080516020613698833981519152610eae816108f161122a565b610b9283611a9c565b60008060346000610ec661122a565b6001600160a01b0390811682526020808301939093526040918201600090812091881681529252902054905082811015610f505760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b6064820152608401610994565b610f64610f5b61122a565b85858403611234565b5060019392505050565b6000610f7c816108f161122a565b61016380546001600160a01b0319166001600160a01b0384169081179091556040517f9c4d5c11b88d1e3d9c7ad50900cb6d10ac72853248cdc85ca868fb772e62b44990600090a25050565b6000610825610fd561122a565b8484611b80565b6000600080516020613698833981519152610ff9816108f161122a565b610bbf8484611d5a565b600054610100900460ff168061101c575060005460ff16155b6110385760405162461bcd60e51b815260040161099490613400565b600054610100900460ff1615801561105a576000805461ffff19166101011790555b611068878787878787611ed6565b801561107a576000805461ff00191690555b50505050505050565b600061109160fe5460ff1690565b1561109e575060016108cc565b6001600160a01b0384166000908152610130602052604090205460ff16156110c8575060026108cc565b610163546001600160a01b0316156110ec576110e5848484611f85565b90506108cc565b5060009392505050565b6067805461083b906135ad565b600082815260cc6020526040902060010154611121816108f161122a565b61090083836114bb565b6000611139816108f161122a565b5061019680546001600160a01b0319166001600160a01b0392909216919091179055565b600061116b816108f161122a565b8151610900906066906020850190612e74565b600060008051602061369883398151915261119b816108f161122a565b610b9283612013565b6000805160206136b88339815191526111bf816108f161122a565b6111cb858585856120ea565b5050505050565b60606101cd80548060200260200160405190810160405280929190818152602001828054801561080757602002820191906000526020600020905b81548152602001906001019080831161120d575050505050905090565b6000610913612141565b6001600160a01b0383166112965760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b6064820152608401610994565b6001600160a01b0382166112f75760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b6064820152608401610994565b6001600160a01b0383811660008181526034602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591015b60405180910390a3505050565b60008061136785858561216a565b9050600181151514156108c95761137c61122a565b6001600160a01b0316856001600160a01b03167f7c2b9369bf4a6bd9745889c658ad00a4d57e280c4c80fa1c74db2a9e52c13635856040516113c091815260200190565b60405180910390a3949350505050565b6113da8282610e57565b6109a7576113f2816001600160a01b03166014612228565b6113fd836020612228565b60405160200161140e929190613334565b60408051601f198184030181529082905262461bcd60e51b8252610994916004016133ed565b61143e8282610e57565b6109a757600082815260cc602090815260408083206001600160a01b03851684529091529020805460ff1916600117905561147761122a565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6114c58282610e57565b156109a757600082815260cc602090815260408083206001600160a01b03851684529091529020805460ff191690556114fc61122a565b6001600160a01b0316816001600160a01b0316837ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b60405160405180910390a45050565b60fe5460ff166115895760405162461bcd60e51b815260206004820152601460248201527314185d5cd8589b194e881b9bdd081c185d5cd95960621b6044820152606401610994565b60fe805460ff191690557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa6115bc61122a565b6040516001600160a01b03909116815260200160405180910390a1565b6001600160a01b03821661162f5760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f2061646472657373006044820152606401610994565b61163b6000838361240a565b806035600082825461164d9190613508565b90915550506001600160a01b0382166000908152603360205260408120805483929061167a908490613508565b90915550506040518181526001600160a01b038316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a35050565b6001600160a01b0381166000908152610130602052604081205460ff166116ed57506000919050565b6001600160a01b038216600081815261013060205260409020805460ff1916905561171661122a565b6001600160a01b03167f4f3ab9ff0cc4f039268532098e01239544b0420171876e36889d01c62c784c7960405160405180910390a3506001919050565b600080806117618486612567565b845490915081141561177a5760008092509250506117b0565b600184600101828154811061179f57634e487b7160e01b600052603260045260246000fd5b906000526020600020015492509250505b9250929050565b6001600160a01b0382166118175760405162461bcd60e51b815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f206164647265736044820152607360f81b6064820152608401610994565b6118238260008361240a565b6001600160a01b038216600090815260336020526040902054818110156118975760405162461bcd60e51b815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e604482015261636560f01b6064820152608401610994565b6001600160a01b03831660009081526033602052604081208383039055603580548492906118c6908490613553565b90915550506040518281526000906001600160a01b038516907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200161134c565b61016354604051637f4ab1dd60e01b815260ff831660048201526060916001600160a01b031690637f4ab1dd9060240160006040518083038186803b15801561195157600080fd5b505afa158015611965573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526107799190810190613245565b60fe5460ff16156119d35760405162461bcd60e51b815260206004820152601060248201526f14185d5cd8589b194e881c185d5cd95960821b6044820152606401610994565b60fe805460ff191660011790557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a2586115bc61122a565b6001600160a01b0381166000908152610130602052604081205460ff1615611a3357506000919050565b6001600160a01b038216600081815261013060205260409020805460ff19166001179055611a5f61122a565b6001600160a01b03167f51d18786e9cb144f87d46e7b796309ea84c7c687d91e09c97f051eacf59bc52860405160405180910390a3506001919050565b6000814210611aed5760405162461bcd60e51b815260206004820152601e60248201527f536e617073686f74207363686564756c656420696e20746865207061737400006044820152606401610994565b6000611af883612646565b5090508015611b195760405162461bcd60e51b81526004016109949061344e565b6101cd805460018101825560009182527f41bf21270d8c221a457e2f64e0b5e3c274a814409eea17edf41bb9eb4ee64eb0018490556040518491907fe2ad3b1abe53383dbe6359f02f11ae76d91cfab321b37083b16e1d96a81d4183908290a35090919050565b6001600160a01b038316611be45760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b6064820152608401610994565b6001600160a01b038216611c465760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b6064820152608401610994565b611c5183838361240a565b6001600160a01b03831660009081526033602052604090205481811015611cc95760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b6064820152608401610994565b6001600160a01b03808516600090815260336020526040808220858503905591851681529081208054849290611d00908490613508565b92505081905550826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051611d4c91815260200190565b60405180910390a350505050565b6000824210611da35760405162461bcd60e51b8152602060048201526015602482015274536e617073686f7420616c726561647920646f6e6560581b6044820152606401610994565b814210611df25760405162461bcd60e51b815260206004820152601e60248201527f536e617073686f74207363686564756c656420696e20746865207061737400006044820152606401610994565b6000611dfd83612646565b5090508015611e1e5760405162461bcd60e51b81526004016109949061344e565b600080611e2a86612646565b9150915081611e705760405162461bcd60e51b815260206004820152601260248201527114db985c1cda1bdd081b9bdd08199bdd5b9960721b6044820152606401610994565b846101cd8281548110611e9357634e487b7160e01b600052603260045260246000fd5b6000918252602082200191909155604051869188917fe2ad3b1abe53383dbe6359f02f11ae76d91cfab321b37083b16e1d96a81d41839190a35092949350505050565b600054610100900460ff1680611eef575060005460ff16155b611f0b5760405162461bcd60e51b815260040161099490613400565b600054610100900460ff16158015611f2d576000805461ffff19166101011790555b611f356126b4565b611f416000848461271f565b611f496126b4565b611f5385856127c5565b611f5b61285a565b611f636126b4565b611f6c866128cf565b611f746126b4565b611f7c6126b4565b61106887612957565b6101635460405163d4ce141560e01b81526001600160a01b038581166004830152848116602483015260448201849052600092169063d4ce14159060640160206040518083038186803b158015611fdb57600080fd5b505afa158015611fef573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108c991906132ec565b600081421061205c5760405162461bcd60e51b8152602060048201526015602482015274536e617073686f7420616c726561647920646f6e6560581b6044820152606401610994565b60008061206884612646565b91509150816120ae5760405162461bcd60e51b815260206004820152601260248201527114db985c1cda1bdd081b9bdd08199bdd5b9960721b6044820152606401610994565b6120b781612a6a565b60405184907f06e2498f5548e5491bfe985562cc494131eae56b5b6543b59129c8886f129f6590600090a2509192915050565b6120f5848484611b80565b836001600160a01b031661210761122a565b6001600160a01b03167f8bf00034cf7dbbafd6d7fc377fdd13d78dbe29684ad4b57d295b99f74dd2ed4a8484604051611d4c929190613496565b610196546000906001600160a01b0316331415612165575060131936013560601c90565b503390565b6000612177848484611b80565b6001600160a01b03841660009081526034602052604081208161219861122a565b6001600160a01b03166001600160a01b031681526020019081526020016000205490508281101561221c5760405162461bcd60e51b815260206004820152602860248201527f45524332303a207472616e7366657220616d6f756e74206578636565647320616044820152676c6c6f77616e636560c01b6064820152608401610994565b610b6185610ce761122a565b60606000612237836002613534565b612242906002613508565b67ffffffffffffffff81111561226857634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f191660200182016040528015612292576020820181803683370190505b509050600360fc1b816000815181106122bb57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350600f60fb1b816001815181106122f857634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350600061231c846002613534565b612327906001613508565b90505b60018111156123bb576f181899199a1a9b1b9c1cb0b131b232b360811b85600f166010811061236957634e487b7160e01b600052603260045260246000fd5b1a60f81b82828151811061238d57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a90535060049490941c936123b481613596565b905061232a565b5083156108cc5760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610994565b60fe5460ff16156124685760405162461bcd60e51b815260206004820152602260248201527f434d5441543a20746f6b656e207472616e73666572207768696c652070617573604482015261195960f21b6064820152608401610994565b6001600160a01b0383166000908152610130602052604090205460ff16156124dd5760405162461bcd60e51b815260206004820152602260248201527f434d5441543a20746f6b656e207472616e73666572207768696c652066726f7a60448201526132b760f11b6064820152608401610994565b6124e8838383612b0b565b610163546001600160a01b03161561090057612505838383612b54565b6109005760405162461bcd60e51b815260206004820152602d60248201527f434d5441543a207472616e736665722072656a65637465642062792076616c6960448201526c646174696f6e206d6f64756c6560981b6064820152608401610994565b815460009061257857506000610779565b82546000905b808210156125e25760006125928383612be2565b9050848682815481106125b557634e487b7160e01b600052603260045260246000fd5b906000526020600020015411156125ce578091506125dc565b6125d9816001613508565b92505b5061257e565b600082118015612625575083856125fa600185613553565b8154811061261857634e487b7160e01b600052603260045260246000fd5b9060005260206000200154145b1561263e57612635600183613553565b92505050610779565b509050610779565b60008060005b6101cd548110156126a857836101cd828154811061267a57634e487b7160e01b600052603260045260246000fd5b9060005260206000200154141561269657600194909350915050565b806126a0816135e2565b91505061264c565b50600093849350915050565b600054610100900460ff16806126cd575060005460ff16155b6126e95760405162461bcd60e51b815260040161099490613400565b600054610100900460ff1615801561270b576000805461ffff19166101011790555b8015610a22576000805461ff001916905550565b600054610100900460ff1680612738575060005460ff16155b6127545760405162461bcd60e51b815260040161099490613400565b600054610100900460ff16158015612776576000805461ffff19166101011790555b6065805460ff191660ff86161790558251612798906066906020860190612e74565b5081516127ac906067906020850190612e74565b5080156127bf576000805461ff00191690555b50505050565b600054610100900460ff16806127de575060005460ff16155b6127fa5760405162461bcd60e51b815260040161099490613400565b600054610100900460ff1615801561281c576000805461ffff19166101011790555b825161282f906036906020860190612e74565b508151612843906037906020850190612e74565b508015610900576000805461ff0019169055505050565b600054610100900460ff1680612873575060005460ff16155b61288f5760405162461bcd60e51b815260040161099490613400565b600054610100900460ff161580156128b1576000805461ffff19166101011790555b60fe805460ff191690558015610a22576000805461ff001916905550565b600054610100900460ff16806128e8575060005460ff16155b6129045760405162461bcd60e51b815260040161099490613400565b600054610100900460ff16158015612926576000805461ffff19166101011790555b61019680546001600160a01b0319166001600160a01b03841617905580156109a7576000805461ff00191690555050565b600054610100900460ff1680612970575060005460ff16155b61298c5760405162461bcd60e51b815260040161099490613400565b600054610100900460ff161580156129ae576000805461ffff19166101011790555b6129b9600083612c39565b6129d16000805160206136b883398151915283612c39565b6129fb7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a683612c39565b612a257f3c11d16cbaffd01df69ce1c404f6340ee057498f5f00246190ea54220576a84883612c39565b612a3d60008051602061367883398151915283612c39565b612a5560008051602061369883398151915283612c39565b80156109a7576000805461ff00191690555050565b6101cd8054612a7b90600190613553565b81548110612a9957634e487b7160e01b600052603260045260246000fd5b90600052602060002001546101cd8281548110612ac657634e487b7160e01b600052603260045260246000fd5b6000918252602090912001556101cd805480612af257634e487b7160e01b600052603160045260246000fd5b6001900381819060005260206000200160009055905550565b612b13612c43565b6001600160a01b03831615612b4b57612b2b83612c63565b6001600160a01b03821615612b435761090082612c63565b610900612c97565b612b4382612c63565b6101635460405163634a350960e11b81526001600160a01b038581166004830152848116602483015260448201849052600092169063c6946a129060640160206040518083038186803b158015612baa57600080fd5b505afa158015612bbe573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108c9919061318e565b60006002612bf081846135fd565b612bfb6002866135fd565b612c059190613508565b612c0f9190613520565b612c1a600284613520565b612c25600286613520565b612c2f9190613508565b6108cc9190613508565b6109a78282611434565b6000612c4d612ca8565b90508015610a22576101cc819055610a22612d76565b6001600160a01b03811660009081526101c960209081526040808320603390925290912054610a229190612dd7565b612dd7565b612ca66101ca612c9260355490565b565b6101cd54600090612cb95750600090565b6000805b6101cd54811015610b9557426101cd8281548110612ceb57634e487b7160e01b600052603260045260246000fd5b906000526020600020015411158015612d2f5750816101cd8281548110612d2257634e487b7160e01b600052603260045260246000fd5b9060005260206000200154115b15612d64576101cd8181548110612d5657634e487b7160e01b600052603260045260246000fd5b906000526020600020015491505b80612d6e816135e2565b915050612cbd565b60005b6101cd54811015610a2257426101cd8281548110612da757634e487b7160e01b600052603260045260246000fd5b906000526020600020015411612dc557612dc081612a6a565b612d79565b612dd0600182613508565b9050612d79565b6000612de36101cc5490565b905080612def84612e23565b1015610900578254600180820185556000858152602080822090930193909355938401805494850181558252902090910155565b8054600090612e3457506000919050565b81548290612e4490600190613553565b81548110612e6257634e487b7160e01b600052603260045260246000fd5b90600052602060002001549050919050565b828054612e80906135ad565b90600052602060002090601f016020900481019282612ea25760008555612ee8565b82601f10612ebb57805160ff1916838001178555612ee8565b82800160010185558215612ee8579182015b82811115612ee8578251825591602001919060010190612ecd565b50612ef4929150612ef8565b5090565b5b80821115612ef45760008155600101612ef9565b8035610e0981613653565b600082601f830112612f28578081fd5b8135612f3b612f36826134e0565b6134af565b818152846020838601011115612f4f578283fd5b816020850160208301379081016020019190915292915050565b600060208284031215612f7a578081fd5b81356108cc81613653565b60008060408385031215612f97578081fd5b8235612fa281613653565b91506020830135612fb281613653565b809150509250929050565b60008060008060008060c08789031215612fd5578182fd5b612fde87612f0d565b9550612fec60208801612f0d565b9450604087013567ffffffffffffffff80821115613008578384fd5b6130148a838b01612f18565b95506060890135915080821115613029578384fd5b6130358a838b01612f18565b9450608089013591508082111561304a578384fd5b6130568a838b01612f18565b935060a089013591508082111561306b578283fd5b5061307889828a01612f18565b9150509295509295509295565b600080600060608486031215613099578283fd5b83356130a481613653565b925060208401356130b481613653565b929592945050506040919091013590565b600080600080608085870312156130da578384fd5b84356130e581613653565b935060208501356130f581613653565b925060408501359150606085013567ffffffffffffffff811115613117578182fd5b61312387828801612f18565b91505092959194509250565b60008060408385031215613141578182fd5b823561314c81613653565b946020939093013593505050565b60008060006060848603121561316e578283fd5b833561317981613653565b95602085013595506040909401359392505050565b60006020828403121561319f578081fd5b815180151581146108cc578182fd5b6000602082840312156131bf578081fd5b5035919050565b600080604083850312156131d8578182fd5b823591506020830135612fb281613653565b6000602082840312156131fb578081fd5b81356001600160e01b0319811681146108cc578182fd5b600060208284031215613223578081fd5b813567ffffffffffffffff811115613239578182fd5b610bbf84828501612f18565b600060208284031215613256578081fd5b815167ffffffffffffffff81111561326c578182fd5b8201601f8101841361327c578182fd5b805161328a612f36826134e0565b81815285602083850101111561329e578384fd5b610c1882602083016020860161356a565b600080604083850312156132c1578182fd5b50508035926020909101359150565b6000602082840312156132e1578081fd5b81356108cc81613668565b6000602082840312156132fd578081fd5b81516108cc81613668565b6000815180845261332081602086016020860161356a565b601f01601f19169290920160200192915050565b7f416363657373436f6e74726f6c3a206163636f756e742000000000000000000081526000835161336c81601785016020880161356a565b7001034b99036b4b9b9b4b733903937b6329607d1b601791840191820152835161339d81602884016020880161356a565b01602801949350505050565b6020808252825182820181905260009190848201906040850190845b818110156133e1578351835292840192918401916001016133c5565b50909695505050505050565b6020815260006108cc6020830184613308565b6020808252602e908201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160408201526d191e481a5b9a5d1a585b1a5e995960921b606082015260800190565b60208082526028908201527f536e617073686f7420616c7265616479207363686564756c656420666f7220746040820152676869732074696d6560c01b606082015260800190565b8281526040602082015260006108c96040830184613308565b604051601f8201601f1916810167ffffffffffffffff811182821017156134d8576134d861363d565b604052919050565b600067ffffffffffffffff8211156134fa576134fa61363d565b50601f01601f191660200190565b6000821982111561351b5761351b613611565b500190565b60008261352f5761352f613627565b500490565b600081600019048311821515161561354e5761354e613611565b500290565b60008282101561356557613565613611565b500390565b60005b8381101561358557818101518382015260200161356d565b838111156127bf5750506000910152565b6000816135a5576135a5613611565b506000190190565b600181811c908216806135c157607f821691505b60208210811415610b9557634e487b7160e01b600052602260045260246000fd5b60006000198214156135f6576135f6613611565b5060010190565b60008261360c5761360c613627565b500690565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052601260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b6001600160a01b0381168114610a2257600080fd5b60ff81168114610a2257600080fdfe65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a809a0fc49fc0600540f1d39e23454e1f6f215bc7505fa22b17c154616570ddef973ef39d76cc2c6090feab1c030bec6ab5db557f64df047a4c4f9b5953cf1df3a26469706673582212208c3d94fca883ab307f70945b8159177dc02231cd690edec9349d323ab7d3904664736f6c63430008040033";
    const result = await web3.eth.sendTransaction({
      from: owner,
      data: rawContract,
      value: 0,
      gas: 4700000,
      gasPrice: 20000000000,
    });
    console.log(result);
    const CMTAT_DEPLOYED_CONTRACT = result.contractAddress;
    // With the first version of CMTAT
    this.upgradeableCMTATInstance = await deployProxy(
      CMTAT1,
      [owner, _, "CMTA Token", "CMTAT", "CMTAT_ISIN", "https://cmta.ch"],
      { initializer: "initialize", constructorArgs: [],from: owner }
    );
    (
      await this.upgradeableCMTATInstance.balanceOf(owner)
    ).should.be.bignumber.equal("0");
    const implementationContractAddress1 = erc1967.getImplementationAddress(
      this.upgradeableCMTATInstance.address,
      {
        from: owner,
      }
    );

    // Issue 20 and check balances and total supply
    ({ logs: this.logs1 } = await this.upgradeableCMTATInstance.mint(
      address1,
      20,
      {
        from: owner,
      }
    ));
    (
      await this.upgradeableCMTATInstance.balanceOf(address1)
    ).should.be.bignumber.equal('20');
    (
      await this.upgradeableCMTATInstance.totalSupply()
    ).should.be.bignumber.equal('20')

    // With the new version
    // With the first version of CMTAT
    // this.upgradeableCMTATV2Instance = await upgradeProxy(this.upgradeableCMTATInstance.address, CMTAT2, { constructorArgs: [] })

    // Get the admin proxy
    const ADMIN_PROXY = await erc1967.getAdminAddress(
      this.upgradeableCMTATInstance.address,
      {
        from: owner
      }
    )
    console.log("ADMIN", ADMIN_PROXY)
    console.log("owner", owner)
    // let receipt = await web3.eth.waitForTransactionReceipt(result)
  });*/
});
