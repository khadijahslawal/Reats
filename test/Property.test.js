const assert = require("assert");
const ganache = require("ganache-cli");
//const options = { gasLimit: 8000000 };
const Web3 = require("web3");
const web3 = new Web3(ganache.provider({ gasLimit: 30000000 }));

const compliedFactory = require('../ethereum/build/PropertyFactory.json');
const compiledProperty = require('../ethereum/build/PropertyContract.json');

let accounts;
let factory;
let property;
let propertyAddress;

beforeEach(async() => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(compliedFactory.abi)
      .deploy({data: '0x' + compliedFactory.evm.bytecode.object})
      .send({from: accounts[0], gas:"3000000"});
    
    await factory.methods.createProperty('1', "Roving heights", "Dubai", '7500000', '30000', '3000').send({
      from : accounts[0],
      gas: '3000000'
    });

    [propertyAddress] = await factory.methods.getDeployedProperties().call();

     property = await new web3.eth.Contract(compiledProperty.abi, propertyAddress);
});

describe('Properties', () => {
    it('deploys a factory and a property', () => {
      assert.ok(factory.options.address);
      assert.ok(property.options.address);
    });

    it('factory calling address is same as developer', async () => {
       const developer = await property.methods.developer().call();
       assert.strictEqual(accounts[0], developer);
    });
    
    it('allows people to invest', async() => {
      await property.methods.invest().send({
        value: '3200',
        from: accounts[1]
      });

      const isInvestor = await property.methods.investors(accounts[1]).call();
      assert(isInvestor > '3000', 'invested minimum amount')
    });

    it('allows marks them as approvers', async() => {
      await property.methods.invest().send({
        value: '3200',
        from: accounts[1]
      });
      const isApprover = await property.methods.approvers(accounts[1]).call();
      assert(isApprover);
    });

    it("requires a minimum contribution", async () => {
      try {
        await property.methods
          .invest()
          .send({ from: accounts[1], value: 2000});
        assert(false);
      } catch (e) {
        assert(e);
      }
    });

    it("allows tenant to make rental requests", async () => {
      await property.methods.createRentalRequests('30000', accounts[0]).send({
        from: accounts[0],
        gas: '1000000'
      });
      const request = await property.methods.rentalRequests(0).call();
      assert.strictEqual('30000', request.value);
    });
    
    it("allows to finalizeRequest", async () => {
      await property.methods.invest().send({
        from: accounts[0],
        value: '3005'
      });
      await property.methods.createRentalRequests("100", accounts[1]).send({
        from: accounts[0],
        gas: 3000000
      });
      await property.methods.approveRentalRequest(0).send({
        from: accounts[0],
        gas: 3000000
      });
      await property.methods.finalizeRequest(0).send({
        from: accounts[0],
        gas: 3000000
      });
      let request = await property.methods.rentalRequests(0).call();
      assert.ok(request.complete);
    });
});