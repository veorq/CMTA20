// SPDX-License-Identifier: MPL-2.0

pragma solidity ^0.8.20;
import "../IDebtGlobal.sol";

interface IDebtEngine is IDebtGlobal {
    /**
     * @dev Returns true if the operation is authorized, and false otherwise.
     */
    function debt() external returns(IDebtGlobal.DebtBase memory);
    /**
     * @dev Returns true if the operation is authorized, and false otherwise.
     */
    function creditEvents() external returns(IDebtGlobal.CreditEvents memory);
   
}
