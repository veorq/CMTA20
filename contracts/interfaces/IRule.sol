//SPDX-License-Identifier: MPL-2.0

pragma solidity ^0.8.17;

import "./IERC1404.sol";


interface IRule is IERC1404 {
     /**
     * @dev Returns true if the restriction code exists, and false otherwise.
     */
     function canReturnTransferRestrictionCode(uint8 _restrictionCode)
        external
        view
        returns (bool);
}
