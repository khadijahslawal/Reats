
import React, { Component } from "react";
import Layout from "../../components/Layout";
import PropertyContract from "../../ethereum/property";
import web3 from "../../ethereum/web3";
import { Card, Grid, Button } from "semantic-ui-react";
import InvestForm from "../../components/InvestForm";
import { Link } from "../../routes";

class PropertyShow extends Component {
    static async getInitialProps(props) {
         const property = PropertyContract(props.query.address);
         const summary = await property.methods.getSummary().call();
         return {
          address: props.query.address,
          minimumInvestment: summary[0],
          balance: summary[1],
          rentalRequestCount: summary[2],
          investorsCount: summary[3],
          rentalStatus: summary[4],
          developer: summary[5],
          propertyName: summary[6],
          city: summary[7],
          sellingPrice: summary[8],
          rentingPrice: summary[9]
        };
    }

    renderCards() {
        const {
          minimumInvestment,
          balance,
          rentalRequestCount,
          investorsCount,
          rentalStatus,
          developer,
          propertyName,
          city,
          sellingPrice,
          rentingPrice

        } = this.props;

    const items = [
        {
            header: propertyName + " , " + city 
          },
          {
              header: "Sale Price", 
              meta: sellingPrice
          },
        {
          header: developer,
          meta: "Address of Developer",
          description:
            "The developer who owns this property, Developer can finalize rental contracts.",
           style: { overflowWrap: "break-word" }
        }, 
         
        {
        header: minimumInvestment,
        meta: "Minimum Contribution (wei)",
        description:
          "You must contribute atleast this much to become an investor",
      },
      {
        header: rentalRequestCount,
        meta: "Number of rental requests",
        description:
          "Rental Request. Requests must be approved by investors",
      },
      {
        header: investorsCount,
        meta: "Number of investors",
        description:
          "Number of people who have invested into this property.",
      },
      {
        header: web3.utils.fromWei(balance, "ether"),
        meta: "Property Balance (ethers)",
        description:
          "Balance is how much has been invested into the property.",
      },
      {
        header: rentalStatus,
        meta: "Property Rental Status",
        description:
          "Marks property as rented or not",
      },
    
        ];

    return <Card.Group items={items} />;
    }


    render() {
        return (
          <Layout>
            <div>
              <h1>Property Details</h1>
              <Grid>
                <Grid.Row>
                  <Grid.Column mobile={9}>{this.renderCards()}</Grid.Column>
                  <Grid.Column mobile={5}>
                    <InvestForm address={this.props.address} />
                  </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                  <Grid.Column>
                    <Link route={`/properties/${this.props.address}/requests`}>
                      <a>
                        <Button primary>View Rental Requests</Button>
                      </a>
                    </Link>
                  </Grid.Column>
                </Grid.Row>
                
              </Grid>
            </div>
          </Layout>
        );
      }
}

export default PropertyShow;