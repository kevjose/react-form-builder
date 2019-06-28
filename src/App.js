import React from 'react';
import DynamicForm from './components/dynamic-form';

import './App.css';

class App extends React.Component {
  state = {
    data: [],
    model: JSON.stringify(
      [
        { key: 'name', label: 'Name', props: { required: true } },
        { key: 'age', label: 'Age', type: 'number' },
        {
          key: 'rating',
          label: 'Rating',
          type: 'number',
          props: { min: 0, max: 5 }
        },
        {
          key: 'gender',
          label: 'Gender',
          type: 'radio',
          options: [
            {
              key: 'male',
              label: 'Male',
              name: 'gender',
              value: 'male'
            },
            {
              key: 'female',
              label: 'Female',
              name: 'gender',
              value: 'female'
            }
          ]
        },
        { key: 'qualification', label: 'Qualification' },
        {
          key: 'city',
          label: 'City',
          type: 'select',
          value: 'Kerala',
          props: { required: true },
          options: [
            { key: '_placeholder', label: 'Select a city', value: '' },
            { key: 'mumbai', label: 'Mumbai', value: 'Mumbai' },
            {
              key: 'bangalore',
              label: 'Bangalore',
              value: 'Bangalore'
            },
            { key: 'kerala', label: 'Kerala', value: 'Kerala' }
          ]
        },
        {
          key: 'skills',
          label: 'Skills',
          type: 'checkbox',
          options: [
            { key: 'reactjs', label: 'ReactJS', value: 'reactjs' },
            { key: 'angular', label: 'Angular', value: 'angular' },
            { key: 'vuejs', label: 'VueJS', value: 'vuejs' }
          ]
        }
      ],
      null,
      2
    )
  };

  handleModel = e => {
    this.setState({ model: e.target.value });
  };
  onSubmit = model => {
    let data = [];
    if (model.id) {
      data = this.state.data.filter(d => {
        return d.id !== model.id;
      });
    } else {
      model.id = +new Date();
      data = this.state.data.slice();
    }

    this.setState({
      data: [model, ...data],
      currentRecord: {}
    });
  };

  onEdit = id => {
    let record = this.state.data.find(d => {
      return d.id === id;
    });
    this.setState({
      currentRecord: record
    });
  };

  renderTableHead = () => {
    console.log(this.state.data);
    if (!this.state.data[0]) {
      return <td>No Data!</td>;
    }
    let dataHead = Object.keys(this.state.data[0]);
    return dataHead.map(d => {
      return <td key={'th_' + d}>{d}</td>;
    });
  };
  renderRow = r => {
    return Object.keys(r).map(p => <td key={'td_' + p}>{r[p]}</td>);
  };

  renderForm = () => {
    try {
      return (
        <DynamicForm
          title="Registration"
          defaultValues={this.state.currentRecord}
          model={JSON.parse(this.state.model)}
          onSubmit={model => {
            this.onSubmit(model);
          }}
        />
      );
    } catch (e) {
      return <p>Invalid form, ensure that the JSON is valid</p>;
    }
  };
  render() {
    let data = this.state.data.map(d => {
      return (
        <tr key={d.id}>
          {this.renderRow(d)}
          {/* <td>{d.name}</td>
          <td>{d.age}</td>
          <td>{d.qualification}</td>
          <td>{d.gender}</td>
          <td>{d.rating}</td>
          <td>{d.city}</td>
          <td>{d.skills && d.skills.length ? d.skills.join(', ') : ''}</td> */}
          <td>
            <button
              className="ui button basic negative"
              onClick={() => this.onEdit(d.id)}
            >
              Edit
            </button>
          </td>
        </tr>
      );
    });
    return (
      <div className="ui container" style={{ paddingTop: '50px' }}>
        <div className="ui two column stackable grid container">
          <div className="column showcase">
            <h4 className="ui dividing header">Form Schema</h4>
            <textarea
              style={{ fontFamily: 'monospace' }}
              className="json-input"
              value={this.state.model}
              onChange={this.handleModel}
            />
          </div>
          <div className="column">
            <h4 className="ui dividing header">Rendered Form</h4>
            {this.renderForm()}
          </div>
        </div>
        <div className="clearfix" />
        <br />
        <br />
        <br />
        <div className="ui column stackable grid container">
          <div className="column">
            <h4 className="ui dividing header">Data</h4>
            <table className="ui stacked table">
              <thead>
                <tr>{this.renderTableHead()}</tr>
              </thead>
              <tbody>{data}</tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
