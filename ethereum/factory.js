import web3 from "./web3";
import PropertyFactory from "./build/PropertyFactory.json";

const instance = new web3.eth.Contract(
    PropertyFactory.abi,
   "0x1d81F3720C15f9a9B7917Ec436386D11623a6bd4"
  );
  
  export default instance;
