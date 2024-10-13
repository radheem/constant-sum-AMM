import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("FOOBA", (m) => {
  const fooba = m.contract("FOOBA");
  return { fooba };
});