const {
  expectRevertCustomError
} = require('../../../openzeppelin-contracts-upgradeable/test/helpers/customError.js')
const { DEFAULT_ADMIN_ROLE, PAUSER_ROLE } = require('../../utils')
const { ZERO_ADDRESS } = require('../../utils')
const { deployCMTATProxy,
  fixture,
  loadFixture,
  DEPLOYMENT_DECIMAL } = require('../../deploymentUtils')
const { upgrades } = require('hardhat')
describe(
  'Proxy - Security Test',
  function () {
    beforeEach(async function () {
      Object.assign(this, await loadFixture(fixture));
      // Contract to deploy: CMTAT
      this.CMTAT_PROXY = await deployCMTATProxy(this._.address, this.admin.address, this.deployerAddress.address)
      const implementationContractAddress =
        await upgrades.erc1967.getImplementationAddress(
          this.CMTAT_PROXY.target
        )

      const MyContract = await ethers.getContractFactory("CMTAT_PROXY");
      this.implementationContract = MyContract.attach(
        implementationContractAddress
      )
    })

    context('Attacker', function () {
      it('testCannotBeTakenControlByAttacker', async function () {
        // Act
        await expectRevertCustomError(
          this.implementationContract.connect(this.attacker).initialize(
            this.attacker,
            ['CMTA Token',
            'CMTAT',
            DEPLOYMENT_DECIMAL],
            ['CMTAT_ISIN',
            'https://cmta.ch',
            'CMTAT_info'],
            [ZERO_ADDRESS, ZERO_ADDRESS, ZERO_ADDRESS, ZERO_ADDRESS]
          ),
          'InvalidInitialization',
          []
        )
        // act + assert
        await expectRevertCustomError(
          this.implementationContract.connect(this.attacker).pause(),
          'AccessControlUnauthorizedAccount',
          [this.attacker.address, PAUSER_ROLE]
        )
      })
    })
  }
)
