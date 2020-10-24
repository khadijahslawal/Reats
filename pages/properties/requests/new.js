import React, { Component } from "react";
import { Input, Form, Button, Message } from "semantic-ui-react";
import PropertyContract from "../../../ethereum/property";
import web3 from "../../../ethereum/web3";
import { Link, Router } from "../../../routes";
import Layout from "../../../components/Layout";

class RequestNew extends Component {
  state = {
    value: "",
    renter: "",
    errorMessage: "",
    loading: false,
  };

  static async getInitialProps(props) {
    const { address } = props.query;
    return { address };
  }

  onSubmit = async (event) => {
    event.preventDefault();
    const property = PropertyContract(this.props.address);
    const { value, renter } = this.state;

    this.setState({ loading: true, errorMessage: "" });

    try {
      const accounts = await web3.eth.getAccounts();
      await property.methods
        .createRentalRequests(web3.utils.toWei(value, "ether"), renter)
        .send({
          from: accounts[0],
        });
      Router.pushRoute(`/properties/${this.props.address}/requests`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({
      loading: false,
      value: "",
      recipient: "",
    });
  };

  render() {
    return (
      <Layout>
        <Link route={`/properties/${this.props.address}/requests`}>
          <a>Back</a>
        </Link>
        <h3>Create a Request</h3>

        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>

          <Form.Field>
            <label>Value in ether</label>
            <Input
              value={this.state.value}
              onChange={(event) => this.setState({ value: event.target.value })}
            />
          </Form.Field>

          <Form.Field>
            <label>Renter</label>
            <Input
              value={this.state.renter}
              onChange={(event) =>
                this.setState({ renter: event.target.value })
              }
            />
          </Form.Field>
          
          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button loading={this.state.loading} primary type="submit">
            Create New Request
          </Button>
        </Form>

      </Layout>
    );
  }
}

export default RequestNew;