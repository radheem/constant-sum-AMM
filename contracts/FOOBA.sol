// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FOOBA is ERC20 {
  address private _owner;
  constructor() ERC20("FOOBA", "FB")
  {
    _mint(msg.sender, 1000000 * 10 ** decimals());
    _owner = msg.sender;
  }

  function getOwner() public view returns (address) {
    return _owner;
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
