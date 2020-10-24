import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import PropertyContract from "../ethereum/property";

class RequestRow extends Component {
  onApprove = async () => {
    const property= PropertyContract(this.props.address);
    const accounts = await web3.eth.getAccounts();
    await property.methods
      .approveRentalRequest(this.props.id)
      .send({ from: accounts[0] });
  };

  onFinalize = async () => {
    const property = PropertyContract(this.props.address);
    const accounts = await web3.eth.getAccounts();
    await property.methods
      .finalizeRequest(this.props.id)
      .send({ from: accounts[0] });
  };

  render() {
    const { request, id, approversCount } = this.props;
    const readyToFinalize = request.approvalCount > approversCount / 2;
    return (
      <Table.Row
        disabled={request.complete}
        positive={!!readyToFinalize && !request.complete}
      >
        <Table.Cell>{id}</Table.Cell>
        <Table.Cell>{web3.utils.fromWei(request.value, "ether")}</Table.Cell>
        <Table.Cell>{request.renter}</Table.Cell>
        <Table.Cell>
          {request.approvalCount}/{approversCount}
        </Table.Cell>
        <Table.Cell>
          {request.complete ? null : (
            <Button color="green" basic onClick={this.onApprove}>
              Approve
            </Button>
          )}
        </Table.Cell>
        <Table.Cell>
          {request.complete ? null : (
            <Button color="teal" basic onClick={this.onFinalize}>
              Finalize
            </Button>
          )}
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default RequestRow;