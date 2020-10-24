import React, { Component } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import Layout from '../../components/Layout';
import { Router } from "../../routes";

class PropertyNew extends Component {
    state = {
        //id: 1,
        name: '',
        city: '',
        sellingPrice: '',
        rentPrice: '',
        minimumInvestment: '',
        errorMessage: '',
        loading: false
    };

    onSubmit = async event => {
        event.preventDefault();
        this.setState({ loading: true, errorMessage: "" });
        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods
                .createProperty('1', this.state.name, this.state.city, this.state.sellingPrice, this.state.rentPrice, this.state.minimumInvestment)
                .send({ from: accounts[0] });
            Router.pushRoute("/");
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }
        this.setState({ loading: false });
    };

    render() {
        return (
            <Layout>
                <h1>Post New Property!</h1>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Property Name</label>
                        <Input
                            value={this.state.name}
                            onChange={event => this.setState({ name: event.target.value })}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>City</label>
                        <Input
                            value={this.state.city}
                            onChange={event => this.setState({ city: event.target.value })}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Selling Price</label>
                        <Input
                            value={this.state.sellingPrice}
                            onChange={event => this.setState({ sellingPrice: event.target.value })}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Rental Price</label>
                        <Input
                            value={this.state.rentPrice}
                            onChange={event => this.setState({ rentPrice: event.target.value })}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Minimum Investment</label>
                        <Input
                            label="wei"
                            labelPosition="right"
                            value={this.state.minimumInvestment}
                            onChange={event => this.setState({ minimumInvestment: event.target.value })}
                        />
                    </Form.Field>
                    <Message error header="Oops!" content={this.state.errorMessage} />
                    <Button loading={this.state.loading}  primary type="submit">Post</Button>
                </Form>
            </Layout>
        );
    }
}

export default PropertyNew;