const ERC20MintModuleCommon = require('../../common/ERC20MintModuleCommon')
const { deployCMTATStandalone, fixture, loadFixture } = require('../../deploymentUtils')
describe(
  'Standard - ERC20MintModule',
  function () {
    beforeEach(async function () {
      Object.assign(this, await loadFixture(fixture));
      this.cmtat = await deployCMTATStandalone(this._, this.admin, this.deployerAddress)
    })

    ERC20MintModuleCommon()
  }
)
