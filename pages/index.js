import React, { Component } from 'react';
import { Card, Button, Image } from 'semantic-ui-react';
import Layout from '../components/Layout';
import factory from "../ethereum/factory";
import { Link } from "../routes";


class PropertyIndex extends Component {
    static async getInitialProps() {
        const properties = await factory.methods.getDeployedProperties().call();
        return { properties };
    }

    renderProperties() {
        const items = this.props.properties.map(address => {
            return {
                header: address,
                description: (
                    <Link route={`/properties/${address}`}>
                      <a>View Property</a>
                    </Link>
                  ),
                image: "https://images.unsplash.com/photo-1591474200742-8e512e6f98f8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=967&q=80",
                fluid: true
            };
        });
        return <Card.Group items={items} />;
    }

    render() {
        return (
            <Layout>
                <div >
                    <h3>Properties</h3>
                    <Link route="/properties/new">
                        <a>
                            <Button
                                floated="right"
                                content="Add Property"
                                icon="add circle"
                                primary
                            />
                        </a>
                    </Link>
                    {this.renderProperties()}
                </div>
            </Layout>);
    }

}

export default PropertyIndex;

