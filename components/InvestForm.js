import React, { Component } from "react";
import { Form, Button, Input, Message } from "semantic-ui-react";
import PropertyContract from "../ethereum/property";
import web3 from "../ethereum/web3";
import { Router } from "../routes";

class InvestForm extends Component {
    state = {
        investment: "",
        errorMessage: "",
        loading: false
    };

onSubmit = async event => {
    event.preventDefault();
    const property = PropertyContract(this.props.address);
    this.setState({ loading: true, errorMessage: "" });

    try {
        const accounts = await web3.eth.getAccounts();
        await property.methods.invest().send({
            from: accounts[0],
            value: web3.utils.toWei(this.state.investment, "ether")
        });
        Router.replaceRoute(`/properties/${this.props.address}`);
    } catch (err) {
        this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false, investment: "" });
};
    render() {
        return (
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                    <label>Amount to Invest</label>
                    <Input
                        label="ether"
                        labelPosition="right"
                        value={this.state.investment}
                        onChange={event =>
                            this.setState({ investment: event.target.value })
                        }
                    />
                </Form.Field>
                <Message error header="Oops!" content={this.state.errorMessage} />
                <Button loading={this.state.loading} primary type="submit">
                    Invest!
            </Button>
            </Form>
        );
    }
}

export default InvestForm;
