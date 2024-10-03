const BaseModuleCommon = require('../../common/BaseModuleCommon')
const {
  deployCMTATStandalone,
  DEPLOYMENT_FLAG,
  fixture,
  loadFixture
} = require('../../deploymentUtils')
describe('Standard - BaseModule', function () {
  beforeEach(async function () {
    Object.assign(this, await loadFixture(fixture))
    this.flag = DEPLOYMENT_FLAG // value used in tests
    this.cmtat = await deployCMTATStandalone(
      this._.address,
      this.admin.address,
      this.deployerAddress.address
    )
  })

  BaseModuleCommon()
})
