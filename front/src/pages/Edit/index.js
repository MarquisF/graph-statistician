import React, { Component } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import api from 'Assets/apiConfig';
import { Modal, Table, Divider, Tag, Button } from 'antd';

import './index.scss';

export default class Edit extends Component {
  state = {
    graph: {},
    vertexes: {},
    arcs: [],
    vertexCol: {}
  }

  vertexDom = {}

  /**
   * [description]
   * @return {[type]} [description]
   */
  componentDidMount = async () => {
    const { graphId } = this.props.match.params;

    const socket = io.connect(api.path);

    socket.on(`updatedGraph/${graphId}`, data => {
      const { vertex, arc } = data;

      this.setState( prevState => {
        // 后台需要浓缩arc数据！
        arc !== undefined && prevState.arcs.push(arc);
        return {
          vertexes: {...prevState.vertexes, ...this.convertVertexesArrayToObject([vertex])},
          arcs: prevState.arcs
        };
      });
      this.dataListScrollToBottom();
    });

    const graphRes = await axios.get(`${api.GRAPH}/${graphId}`);
    const { graph, arcs, vertexes, vertexCol } = graphRes.data;
    const vertexColObj = {};
    vertexCol.forEach( item => {
      vertexColObj[item.key] = item;
    });

    this.setState({
      graph, arcs,
      vertexes: this.convertVertexesArrayToObject(vertexes),
      vertexCol: vertexColObj
    });
    this.dataListScrollToBottom();
  }

  /**
   * [description]
   * @return {[type]} [description]
   */
  dataListScrollToBottom = () => {
    document.querySelectorAll('.data-list').forEach( container => {
      container.scrollTop = container.scrollHeight;
    })
  }

  // this operation will ruin the array
  convertVertexesArrayToObject = arr => {
    const arcs = {};
    arr.forEach( item => {
      arcs[item._id] = item;
      delete arcs[item._id]._id;
    });
    return arcs;
  }

  /**
   * [description]
   * @return {[type]} [description]
   */
  renderVertexList = () => {
    const { vertexes, vertexCol } = this.state;
    const vertexKeys = Object.keys(vertexes);
    const colKeys = Object.keys(vertexCol);

    const columns = [{title: 'url', dataIndex: 'url', key: 'url'}];
    colKeys.forEach( colKey => {
      columns.push({
        title: colKey,
        dataIndex: colKey,
        key: colKey,
      });
    });

    const vertexesArr = [];
    vertexKeys.forEach( vertexKey => {
      const item = vertexes[vertexKey];
      const newVertex = { _id: vertexKey, ...item };
      colKeys.forEach( colKey => {
        // const newColValue = vertexCol[colKey].data[vertexKey];
        newVertex[colKey] = ''
      });
      vertexesArr.push(newVertex);
    });

    return <Table columns={columns} dataSource={vertexesArr} pagination={false} />
  }

  /**
   * [description]
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  focusOnVertex = id => {
    this.vertexDom[id].focus();
  }

  /**
   * [description]
   * @param  {[type]} vertexId [description]
   * @return {[type]}          [description]
   */
  arcVertexItem = vertexId => {
    const vertexItem = this.state.vertexes[vertexId];
    return (
      <a href='javascript:void(0)' className='arc-vertex-item' onClick={() => this.focusOnVertex(vertexId)}>
      { vertexItem.url }
      </a>
    )
  }

  /**
   * [description]
   * @return {[type]} [description]
   */
  renderArcList = () => this.state.arcs.map( item => {
    // const { vertexes } = this.state;

    return (
      <li>
        <span>From</span>
        {this.arcVertexItem(item.source)}
        <span>To</span>
        {this.arcVertexItem(item.target)}
      </li>
    );
  })

  /**
   * [description]
   * @return {[type]} [description]
   */
  addVertexColumn = () => {
    this.setState({vertexColAddingModalShow: true});
  }

  vertexColAddingModal_handleOk = async () => {
    const colName = this.newVertexColInput.value;
    const graphId = this.state.graph._id;
    const req = { key: colName, graphId };
    this.setState({vertexColAddingModal_confirmLoading: true});
    const vertexColRes = await axios.post(`${api.VERTEX_COL}`, req);
    this.setState(prevStat => {
      const newVertexCol = vertexColRes.data;
      prevStat.vertexCol[newVertexCol.key] = newVertexCol;
      return {
        vertexColAddingModal_confirmLoading: false,
        vertexColAddingModalShow: false,
        vertexCol: prevStat.vertexCol
      }
    });
    this.newVertexColInput.value = '';
  }

  vertexColAddingModal_handleCancel = () => {
    this.setState({vertexColAddingModalShow: false});
  }

  render() {
    const { graphId } = this.props.match.params;

    return (
      <section className='edit-container'>
        <header>
          <h2>Editing {this.state.graph ? this.state.graph.name : ''}</h2>
          {
            graphId &&
            <div>
              <p>Please paste the following graph Id to the project you are doing statistics.</p>
              <p>Graph Id:</p>
              <p>{graphId}</p>
            </div>
          }
        </header>
        <div><Button onClick={this.addVertexColumn}>Add new Column</Button></div>
        <div className='data-list-container'>
          <section className='data-list vertex-list-container'>
            <ul className='vertex-list'>{this.renderVertexList()}</ul>
          </section>
          <section className='data-list arc-list-container'>
            <ul className='arc-list'>{this.renderArcList()}</ul>
          </section>
        </div>
        <Modal title="Title"
          visible={this.state.vertexColAddingModalShow}
          onOk={this.vertexColAddingModal_handleOk}
          confirmLoading={this.state.vertexColAddingModal_confirmLoading}
          onCancel={this.vertexColAddingModal_handleCancel}
        >
          <input type='text' ref={ c => this.newVertexColInput = c } />
        </Modal>
      </section>
    )
  }
}
