// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract AUSD is ERC20 {
  constructor() ERC20("AUSD", "AUSD")
  {
      _mint(msg.sender, 1000000 * 10 ** decimals());
  }

  function decimals() public view override(ERC20) returns (uint8) {
    return super.decimals();
  }
  
  function mintTo(address to, uint256 amount) public {
    _mint(to, amount);
  }

  function burnFrom(address account, uint256 amount) public {
    _burn(account, amount);
  }

}
