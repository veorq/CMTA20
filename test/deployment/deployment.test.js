const {
  expectRevertCustomError
} = require('../../openzeppelin-contracts-upgradeable/test/helpers/customError.js')
const { ZERO_ADDRESS } = require('../utils')
const {
  deployCMTATProxyWithParameter,
  deployCMTATStandaloneWithParameter,
  fixture, loadFixture 
} = require('../deploymentUtils')
describe('CMTAT - Deployment', function () {
  beforeEach(async function () {
    Object.assign(this, await loadFixture(fixture));
  })

  it('testCannotDeployProxyWithAdminSetToAddressZero', async function () {
    this.flag = 5
    const DECIMAL = 0
    // Act + Assert
    await expectRevertCustomError(
      deployCMTATProxyWithParameter(
        this.deployerAddress.address,
        this._.address,
        ZERO_ADDRESS,
        ZERO_ADDRESS,
        'CMTA Token',
        'CMTAT',
        DECIMAL,
        'CMTAT_ISIN',
        'https://cmta.ch',
        ZERO_ADDRESS,
        'CMTAT_info',
        this.flag
      ),
      'CMTAT_AuthorizationModule_AddressZeroNotAllowed',
      []
    )
  })
  it('testCannotDeployStandaloneWithAdminSetToAddressZero', async function () {
    this.flag = 5
    const DECIMAL = 0
    // Act + Assert
    await expectRevertCustomError(
      deployCMTATStandaloneWithParameter(
        this.deployerAddress.address,
        this._.address,
        ZERO_ADDRESS,
        ZERO_ADDRESS,
        'CMTA Token',
        'CMTAT',
        DECIMAL,
        'CMTAT_ISIN',
        'https://cmta.ch',
        ZERO_ADDRESS,
        'CMTAT_info',
        this.flag
      ),
      'CMTAT_AuthorizationModule_AddressZeroNotAllowed',
      []
    )
  })
})
