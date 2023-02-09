// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract BUSDToken is ERC20, ERC20Permit
{
    string constant TOKEN_NAME = "BUSD";
    string constant TOKEN_SYMBOL = "busd";

    uint8 internal constant DECIMAL_PLACES = 18;
    uint256 public immutable MAX_SUPPLY = 10**10 * 10**DECIMAL_PLACES;

    constructor() ERC20(TOKEN_NAME, TOKEN_SYMBOL) ERC20Permit(TOKEN_NAME) {
        super._mint(msg.sender, MAX_SUPPLY);
    }

    function decimals() public pure override returns (uint8) {
        return DECIMAL_PLACES;
    }
}