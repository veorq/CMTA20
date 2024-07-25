const {
  expectEvent,
  expectRevert,
  time,
  BN
} = require('@openzeppelin/test-helpers')
const {
  expectRevertCustomError
} = require('../../../openzeppelin-contracts-upgradeable/test/helpers/customError')
const { SNAPSHOOTER_ROLE } = require('../../utils')
const { should } = require('chai').should()
const {
  checkArraySnapshot
} = require('./ERC20SnapshotModuleUtils/ERC20SnapshotModuleUtils')

function ERC20SnapshotModuleCommonRescheduling () {
  context('Snapshot rescheduling', function () {
    beforeEach(async function () {
      this.currentTime = await time.latest()
      this.snapshotTime = this.currentTime.add(time.duration.seconds(60))
      this.newSnapshotTime = this.currentTime.add(time.duration.seconds(200))
      await this.cmtat.connect(this.admin).scheduleSnapshot(this.snapshotTime)
    })

    it('can reschedule a snapshot with the snapshoter role and emits a SnapshotSchedule event', async function () {
      this.logs = await this.cmtat.connect(this.admin).rescheduleSnapshot(
        this.snapshotTime,
        this.newSnapshotTime
      )
      expectEvent(this.logs, 'SnapshotSchedule', {
        oldTime: this.snapshotTime,
        newTime: this.newSnapshotTime
      })
      const snapshots = await this.cmtat.getNextSnapshots()
      snapshots.length.should.equal(1)
      snapshots[0].should.be.bignumber.equal(this.newSnapshotTime)
    })

    it('can reschedule a snapshot between a range of snapshot', async function () {
      const SNAPSHOT_MIDDLE_OLD_TIME = this.snapshotTime.add(
        time.duration.seconds(30)
      )
      const SNAPSHOT_MIDDLE_NEW_TIME = this.snapshotTime.add(
        time.duration.seconds(40)
      )
      const FIRST_SNAPSHOT = this.snapshotTime.add(time.duration.seconds(60))
      const SECOND_SNAPSHOT = this.snapshotTime.add(time.duration.seconds(90))
      await this.cmtat.connect(this.admin).scheduleSnapshot(SNAPSHOT_MIDDLE_OLD_TIME)
      await this.cmtat.connect(this.admin).scheduleSnapshot(FIRST_SNAPSHOT)
      await this.cmtat.connect(this.admin).scheduleSnapshot(SECOND_SNAPSHOT)
      this.logs = await this.cmtat.connect(this.admin).rescheduleSnapshot(
        SNAPSHOT_MIDDLE_OLD_TIME,
        SNAPSHOT_MIDDLE_NEW_TIME
      )
      expectEvent(this.logs, 'SnapshotSchedule', {
        oldTime: SNAPSHOT_MIDDLE_OLD_TIME,
        newTime: SNAPSHOT_MIDDLE_NEW_TIME
      })
      const snapshots = await this.cmtat.getNextSnapshots()
      snapshots.length.should.equal(4)
      checkArraySnapshot(snapshots, [
        this.snapshotTime,
        SNAPSHOT_MIDDLE_NEW_TIME,
        FIRST_SNAPSHOT,
        SECOND_SNAPSHOT
      ])
    })

    it('testCannotRescheduleASnapshotAfterTheNextSnapshot', async function () {
      const SNAPSHOT_MIDDLE_OLD_TIME = this.snapshotTime.add(
        time.duration.seconds(30)
      )
      const SNAPSHOT_MIDDLE_NEW_TIME = this.snapshotTime.add(
        time.duration.seconds(61)
      )
      const FIRST_SNAPSHOT = this.snapshotTime.add(time.duration.seconds(60))
      const SECOND_SNAPSHOT = this.snapshotTime.add(time.duration.seconds(90))
      await this.cmtat.connect(this.admin).scheduleSnapshot(SNAPSHOT_MIDDLE_OLD_TIME)
      await this.cmtat.connect(this.admin).scheduleSnapshot(FIRST_SNAPSHOT)
      await this.cmtat.connect(this.admin).scheduleSnapshot(SECOND_SNAPSHOT)
      await expectRevertCustomError(
        this.cmtat.connect(this.admin).rescheduleSnapshot(
          SNAPSHOT_MIDDLE_OLD_TIME,
          SNAPSHOT_MIDDLE_NEW_TIME
        ),
        'CMTAT_SnapshotModule_SnapshotTimestampAfterNextSnapshot',
        [SNAPSHOT_MIDDLE_NEW_TIME, FIRST_SNAPSHOT]
      )
      const snapshots = await this.cmtat.getNextSnapshots()
      snapshots.length.should.equal(4)
      checkArraySnapshot(snapshots, [
        this.snapshotTime,
        SNAPSHOT_MIDDLE_OLD_TIME,
        FIRST_SNAPSHOT,
        SECOND_SNAPSHOT
      ])
    })

    it('testCannotRescheduleASnapshotBeforeThePreviousSnapshot', async function () {
      const SNAPSHOT_MIDDLE_OLD_TIME = this.snapshotTime.add(
        time.duration.seconds(30)
      )
      const SNAPSHOT_MIDDLE_NEW_TIME = this.snapshotTime.sub(
        time.duration.seconds(1)
      )
      const FIRST_SNAPSHOT = this.snapshotTime.add(time.duration.seconds(60))
      const SECOND_SNAPSHOT = this.snapshotTime.add(time.duration.seconds(90))
      await this.cmtat.connect(admin).scheduleSnapshot(SNAPSHOT_MIDDLE_OLD_TIME)
      await this.cmtat.connect(this.admin).scheduleSnapshot(FIRST_SNAPSHOT)
      await this.cmtat.connect(this.admin).scheduleSnapshot(SECOND_SNAPSHOT)
      await expectRevertCustomError(
        this.cmtat.connect(this.admin).rescheduleSnapshot(
          SNAPSHOT_MIDDLE_OLD_TIME,
          SNAPSHOT_MIDDLE_NEW_TIME
        ),
        'CMTAT_SnapshotModule_SnapshotTimestampBeforePreviousSnapshot',
        [SNAPSHOT_MIDDLE_NEW_TIME, this.snapshotTime]
      )
      const snapshots = await this.cmtat.getNextSnapshots()
      snapshots.length.should.equal(4)
      checkArraySnapshot(snapshots, [
        this.snapshotTime,
        SNAPSHOT_MIDDLE_OLD_TIME,
        FIRST_SNAPSHOT,
        SECOND_SNAPSHOT
      ])
    })

    it('reverts when calling from non-owner', async function () {
      // Act
      await expectRevertCustomError(
        this.cmtat.connect(this.address1).rescheduleSnapshot(this.snapshotTime, this.newSnapshotTime),
        'AccessControlUnauthorizedAccount',
        [address1, SNAPSHOOTER_ROLE]
      )
    })

    it('reverts when trying to reschedule a snapshot in the past', async function () {
      const NEW_TIME = this.snapshotTime.sub(time.duration.seconds(60))
      await expectRevertCustomError(
        this.cmtat.connect(this.admin).rescheduleSnapshot(this.snapshotTime, NEW_TIME),
        'CMTAT_SnapshotModule_SnapshotScheduledInThePast',
        [NEW_TIME, (await time.latest()).add(time.duration.seconds(1))]
      )
    })

    it('reverts when trying to reschedule a snapshot to a snapshot time already existing', async function () {
      const NEW_TIME = this.snapshotTime.add(time.duration.seconds(60))
      await this.cmtat.connect(this.admin).scheduleSnapshot(NEW_TIME)
      await expectRevertCustomError(
        this.cmtat.connect(this.admin).rescheduleSnapshot(this.snapshotTime, NEW_TIME),
        'CMTAT_SnapshotModule_SnapshotAlreadyExists',
        []
      )
    })

    it('reverts when trying to schedule a snapshot with the same time twice', async function () {
      /*
      Arrange: we schedule the snapshot at a new time
      */
      await this.cmtat.connect(this.admin).rescheduleSnapshot(
        this.snapshotTime,
        this.newSnapshotTime
      )

      /*
      // Act
      We try to reschedule the previous snapshot
      */
      await expectRevertCustomError(
        this.cmtat.connect(this.admin).rescheduleSnapshot(this.snapshotTime, this.newSnapshotTime),
        'CMTAT_SnapshotModule_SnapshotNotFound',
        []
      )
      // Assert
      const snapshots = await this.cmtat.getNextSnapshots()
      snapshots.length.should.equal(1)
      snapshots[0].should.be.bignumber.equal(this.newSnapshotTime)
    })

    it('reverts when snapshot is not found', async function () {
      const SNAPSHOT_TIME = this.currentTime.add(time.duration.seconds(90))
      await expectRevertCustomError(
        this.cmtat.connect(this.admin).rescheduleSnapshot(SNAPSHOT_TIME, this.newSnapshotTime),
        'CMTAT_SnapshotModule_SnapshotNotFound',
        []
      )
    })

    it('reverts if no snapshot exits', async function () {
      this.logs = await this.cmtat.connect(this.admin).unscheduleLastSnapshot(this.snapshotTime)
      await expectRevertCustomError(
        this.cmtat.connect(this.admin).rescheduleSnapshot(this.snapshotTime, this.newSnapshotTime),
        'CMTAT_SnapshotModule_NoSnapshotScheduled',
        []
      )
    })

    it('reverts when snapshot has been processed', async function () {
      const SNAPSHOT_TIME = this.currentTime.sub(time.duration.seconds(60))
      await expectRevertCustomError(
        this.cmtat.connect(this.admin).rescheduleSnapshot(SNAPSHOT_TIME, this.newSnapshotTime),
        'CMTAT_SnapshotModule_SnapshotAlreadyDone',
        []
      )
    })
  })
}
module.exports = ERC20SnapshotModuleCommonRescheduling
