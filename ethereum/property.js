import web3 from "./web3";
import PropertyContract from "./build/PropertyContract.json";

export default address => {
  return new web3.eth.Contract(PropertyContract.abi, address);
};