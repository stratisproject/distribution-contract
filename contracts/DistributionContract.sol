// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;
import "@openzeppelin/contracts/utils/Address.sol";

contract Distribution {
    uint256 immutable payAfterTimestamp;
    address payable immutable recipient;

    constructor(uint256 _payAfterTimestamp, address payable _recipient) payable {
        require(_payAfterTimestamp >= block.timestamp, "Cannot set timestamp in the past");
        require(address(_recipient) != address(0), "Need to specify a valid recipient address");

        payAfterTimestamp = _payAfterTimestamp;
        recipient = _recipient;
    }
    
    function claim() public {
        require(block.timestamp >= payAfterTimestamp, "Insufficient time elapsed");
        require(address(this).balance > 0, "No balance to claim");

        // As we are sending the entire balance to a fixed recipient here there should
        // be no risk of re-entrancy.
        Address.sendValue(recipient, address(this).balance);
    }
}
