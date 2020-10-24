 // SPDX-License-Identifier: MIT   
pragma solidity ^0.6.5;

contract PropertyFactory {
    address[] public deployedProperties;
    
    function createProperty(uint id, string memory name, string memory city, uint sprice, uint rprice, uint minimum) public{
        address newProperty = address(new PropertyContract(id, name, city, sprice, rprice, minimum, msg.sender));
        deployedProperties.push(newProperty);
    }
    function getDeployedProperties() public view returns(address[] memory) {
        return deployedProperties;
    }
    
}


contract PropertyContract {
    address public developer;
   // address [] public investors;
    mapping (address => uint) public investors;
    mapping (address => bool) public approvers;
    //address [] public tenant;
    uint public approversCount;
    
    struct RentalRequest{
        //uint propertyId;
        uint value; 
        address renter;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }
    
  
    uint propertyId;
    string propertyName;
    string city;
    uint sellingPrice;
    uint rentingPrice;
    string rented;
    uint public minimumInvestment;

    address renter;
    uint rentalRevenue;

    
    RentalRequest [] public rentalRequests;

    
    constructor(uint id, string memory name, string memory location, uint sprice, uint rprice, uint minimum, address creator) public{
        developer = creator;
        propertyId = id;
        propertyName = name;
        city = location;
        sellingPrice = sprice;
        rentingPrice = rprice;
        rented = "Not Rented";
        minimumInvestment = minimum;
    }
    
    function invest() public payable{
        require(msg.value > minimumInvestment);
        investors[msg.sender] = msg.value;
        approvers[msg.sender] = true;
        approversCount++;
    } 
    
  
    function createRentalRequests(uint value, address tenant)
        public onlyTenant{
          RentalRequest memory newRequest = RentalRequest({
             // propertyId : propertyId,
              value : value,
              renter: tenant,
              complete: false,
              approvalCount: 0
          });
          rentalRequests.push(newRequest);
    }
    
    function approveRentalRequest(uint indexOfRequest) public{
        RentalRequest storage request = rentalRequests[indexOfRequest];
        
        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);
        
        request.approvals[msg.sender] = true;
        request.approvalCount++;
        
    }
    
    function finalizeRequest(uint indexOfRequest) public onlyDeveloper{
        RentalRequest storage request = rentalRequests[indexOfRequest];
        require(!request.complete);
        require(request.approvalCount >= (approversCount / 2));
        request.complete = true;
        rentalRevenue = request.value;
        rented = "Rented";
    }
    
    modifier onlyDeveloper(){
        require(msg.sender == developer);
        _;
    }
    
    modifier onlyTenant() {
        require(msg.sender == developer);
        //change to tenant later
        _;
    }

    function getSummary() public view returns (uint, uint, uint, uint, string memory, address, string memory, string memory, uint, uint) {
          return(
              minimumInvestment,
              address(this).balance,
              rentalRequests.length,
              approversCount,
              rented,
              developer,
              propertyName,
              city,
              sellingPrice,
              rentingPrice 
          );
    }

    function getRentalRequestCount()public view returns(uint){
        return rentalRequests.length;
    }
}

