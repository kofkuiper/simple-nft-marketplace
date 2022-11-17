// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TerosoftToken is ERC20 {
    constructor() ERC20("Terosoft Token", "TRS") {
        _mint(msg.sender, 1_000_000 ether);

    }
}
