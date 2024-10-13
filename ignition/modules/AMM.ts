import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("AMM", (m) => {
  const ausd = m.contract("AUSD");
  const fooba = m.contract("FOOBA");
  const amm = m.contract("AMM",[ausd, fooba]);
  return { amm };
});