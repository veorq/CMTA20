//SPDX-License-Identifier: MPL-2.0

pragma solidity ^0.8.20;

import "../../../../openzeppelin-contracts-upgradeable/contracts/security/PausableUpgradeable.sol";
import "../../../../openzeppelin-contracts-upgradeable/contracts/proxy/utils/Initializable.sol";
import "../../security/AuthorizationModule.sol";
import "../../internal/EnforcementModuleInternal.sol";

/**
 * @dev Enforcement module.
 *
 * Allows the issuer to freeze transfers from a given address
 */
abstract contract EnforcementModule is
    EnforcementModuleInternal,
    AuthorizationModule
{
    string internal constant TEXT_TRANSFER_REJECTED_FROM_FROZEN =
        "The address FROM is frozen";

    string internal constant TEXT_TRANSFER_REJECTED_TO_FROZEN =
        "The address TO is frozen";

    function __EnforcementModule_init(address admin, uint48 initialDelayToAcceptAdminRole) internal onlyInitializing {
        /* OpenZeppelin */
        __Context_init_unchained();
        // AccessControlUpgradeable inherits from ERC165Upgradeable
        __ERC165_init_unchained();
        // AuthorizationModule inherits from AccessControlUpgradeable
        __AccessControl_init_unchained();
        __AccessControlDefaultAdminRules_init_unchained(initialDelayToAcceptAdminRole, admin);
        /* CMTAT modules */
        // Internal
        __Enforcement_init_unchained();

        // Security
        __AuthorizationModule_init_unchained();

        // own function
        __EnforcementModule_init_unchained();
    }

    function __EnforcementModule_init_unchained() internal onlyInitializing {
        // no variable to initialize
    }

    /**
     * @notice Freezes an address.
     * @param account the account to freeze
     * @param reason indicate why the account was frozen.
     */
    function freeze(
        address account,
        string calldata reason
    ) public onlyRole(ENFORCER_ROLE) returns (bool) {
        return _freeze(account, reason);
    }

    /**
     * @notice Unfreezes an address.
     * @param account the account to unfreeze
     * @param reason indicate why the account was unfrozen.
     *
     *
     */
    function unfreeze(
        address account,
        string calldata reason
    ) public onlyRole(ENFORCER_ROLE) returns (bool) {
        return _unfreeze(account, reason);
    }

    uint256[50] private __gap;
}
