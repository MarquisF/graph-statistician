import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import api from 'Assets/apiConfig';

export default class MapList extends Component {
  state = {
    graphs: []
  }

  componentDidMount = async () => {
    const graphRes = await axios.get(`${api.GRAPHS}`);
    const graphs = graphRes.data;
    this.setState({graphs});
  }

  renderGraphList = () => this.state.graphs.map( item => {
    const { _id, name } = item;
    return (
      <p>
        <NavLink to={`/edit/${_id}`} key={_id}>{name}</NavLink>
      </p>
    )
  });

  render() {
    console.log(`graphs: `, this.state.graphs)
    return (
      <section>
        <header>
          <h2>Graph Lists</h2>
        </header>
        {this.renderGraphList()}
      </section>
    )
  }
}