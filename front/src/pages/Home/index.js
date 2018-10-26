import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import api from 'Assets/apiConfig';

export default class Home extends Component {
  addNewSitemap = async () => {
    const data = { name: this.sitemapName.value };
    const res = await axios.post(api.GRAPH, data);
    const newGraph = res.data;
    this.props.history.push(`/edit/${newGraph._id}`);
  }

  render() {
    return (
      <section>
        <p>
          <input ref={ c => this.sitemapName = c } type='text' placeholder='Sitemap Name' />
          <a href='javascript:void(0)' onClick={this.addNewSitemap} to='/new'>New Sitemap</a>
        </p>
        <p>
          <NavLink to='/list'>List</NavLink>
        </p>
      </section>
    )
  }
}