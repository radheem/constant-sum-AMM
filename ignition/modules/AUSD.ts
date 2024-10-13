import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("AUSD", (m) => {
  const asud = m.contract("AUSD");
  return { asud };
});