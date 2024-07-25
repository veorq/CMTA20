const { expect } = require('chai');
const {
  expectRevertCustomError
} = require('../../../openzeppelin-contracts-upgradeable/test/helpers/customError')
const {
  PAUSER_ROLE,
  DEFAULT_ADMIN_ROLE
} = require('../../utils')
//const should = chai.should()
function AuthorizationModuleCommon () {
  context('Authorization', function () {
    it('testAdminCanGrantRole', async function () {
      // Act
      this.logs = await this.cmtat.connect(this.admin).grantRole(PAUSER_ROLE, this.address1);
      // Assert
      (await this.cmtat.hasRole(PAUSER_ROLE, this.address1)).should.equal(true)
      // emits a RoleGranted event
      await expect(this.logs).to.emit(this.cmtat, 'RoleGranted').withArgs( PAUSER_ROLE, this.address1, this.admin);
    })

    it('testAdminCanRevokeRole', async function () {
      // Arrange
      await this.cmtat.connect(this.admin).grantRole(PAUSER_ROLE, this.address1);
      // Arrange - Assert
      (await this.cmtat.hasRole(PAUSER_ROLE, this.address1)).should.equal(true)
      // Act
      this.logs = await this.cmtat.connect(this.admin).revokeRole(PAUSER_ROLE, this.address1);
      // Assert
      (await this.cmtat.hasRole(PAUSER_ROLE, this.address1)).should.equal(false)
      // emits a RoleRevoked event
      await expect(this.logs).to.emit(this.cmtat, 'RoleRevoked').withArgs( PAUSER_ROLE, this.address1, this.admin);
    })

    /*
    Already tested by OpenZeppelin library
    */
    it('testCannotNonAdminGrantRole', async function () {
      // Arrange - Assert
      (await this.cmtat.hasRole(PAUSER_ROLE, this.address1)).should.equal(false)
      // Act
      await expectRevertCustomError(
        this.cmtat.connect(this.address2).grantRole(PAUSER_ROLE, this.address1),
        'AccessControlUnauthorizedAccount',
        [this.address2.address, DEFAULT_ADMIN_ROLE]
      );
      // Assert
      (await this.cmtat.hasRole(PAUSER_ROLE, this.address1)).should.equal(false)
    })

    /*
    Already tested by OpenZeppelin library
    */
    it('testCannotNonAdminRevokeRole', async function () {
      // Arrange
      (await this.cmtat.hasRole(PAUSER_ROLE, this.address1)).should.equal(false)
      await this.cmtat.connect(this.admin).grantRole(PAUSER_ROLE, this.address1);
      // Arrange - Assert
      (await this.cmtat.hasRole(PAUSER_ROLE, this.address1)).should.equal(true)
      // Act
      await expectRevertCustomError(
        this.cmtat.connect(this.address2).revokeRole(PAUSER_ROLE, this.address1),
        'AccessControlUnauthorizedAccount',
        [this.address2.address, DEFAULT_ADMIN_ROLE]
      );
      // Assert
      (await this.cmtat.hasRole(PAUSER_ROLE, this.address1)).should.equal(true)
    })
  })
}
module.exports = AuthorizationModuleCommon
