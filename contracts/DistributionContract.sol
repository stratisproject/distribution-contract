// SPDX-License-Identifier: MIT

pragma solidity >0.7.0 <0.9.0;

contract Distribution {
    uint256 payAfterTimestamp;
    address payable recipient;

    constructor(uint256 _payAfterTimestamp, address payable _recipient) payable {
        require(_payAfterTimestamp >= block.timestamp);
        require(address(_recipient) != address(0));

        payAfterTimestamp = _payAfterTimestamp;
        recipient = _recipient;
    }
    
    function claim() public {
        require(block.timestamp >= payAfterTimestamp, "Insufficient time elapsed");

        recipient.transfer(address(this).balance);
    }
}
