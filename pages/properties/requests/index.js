import React, { Component } from "react";
import Layout from "../../../components/Layout";
import PropertyContract from "../../../ethereum/property";
import { Button, Table } from "semantic-ui-react";
import { Link } from "../../../routes";
import RequestRow from "../../../components/RequestRow";

class RentalRequestsIndex extends Component {

    static async getInitialProps(props) {
        const { address } = props.query;
        const property = PropertyContract(address);
        const requestCount = await property.methods.getRentalRequestCount().call();
        const approversCount = await property.methods.approversCount().call();

        const requests = await Promise.all(
            Array(parseInt(requestCount))
                .fill()
                .map((element, index) => {
                    return property.methods.rentalRequests(index).call();
                })
        );
        return { address, requests, requestCount, approversCount };
    }

    renderRow() {
        return this.props.requests.map((request, index) => {
            return (
                <RequestRow
                    onRequestsUpdate={this.onRequestsUpdate}
                    request={request}
                    key={index}
                    id={index}
                    address={this.props.address}
                    approversCount={this.props.approversCount}
                />
            );
        });
    }

    render() {
        return (
            <Layout>
                <Link route={`/properties/${this.props.address}`}>
                    <a>Back</a>
                </Link>
                <h3>Request Lists</h3>
                <Link route={`/properties/${this.props.address}/requests/new`}>
                    <a>
                        <Button primary floated="right" style={{ marginBottom: 10 }}>
                            Add Request
                  </Button>
                    </a>
                </Link>

                <Link route={`/properties/${this.props.address}/requests/`}>
                    <a>
                        <Button primary floated="left" style={{ marginBottom: 10 }}>
                            Refresh
                  </Button>
                    </a>
                </Link>

                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>ID</Table.HeaderCell>
                            <Table.HeaderCell>Amount</Table.HeaderCell>
                            <Table.HeaderCell>Renter</Table.HeaderCell>
                            <Table.HeaderCell>Approval Count</Table.HeaderCell>
                            <Table.HeaderCell>Approve</Table.HeaderCell>
                            <Table.HeaderCell>Finalize</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>{this.renderRow()}</Table.Body>
                </Table>
                <div>Found {this.props.requestCount} requests.</div>
            </Layout>
        );
    }
}



export default RentalRequestsIndex;