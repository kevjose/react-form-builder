import React from 'react';

export default class DynamicForm extends React.Component {
  state = {};
  // constructor(props) {
  //   super(props);
  // }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.submitted === true) {
      for (let key in prevState) {
        prevState[key] = '';
      }
      return { ...prevState };
    }

    if (
      nextProps.defaultValues &&
      Object.keys(nextProps.defaultValues).length
    ) {
      if (
        prevState.id &&
        nextProps.defaultValues.id &&
        prevState.id === nextProps.defaultValues.id
      ) {
        return {
          ...prevState
        };
      }
      return {
        ...nextProps.defaultValues
      };
    } else {
      let initialState = nextProps.model.reduce((acc, m) => {
        let defaultVal = prevState[m.key] || '';
        acc[m.key] = defaultVal;
        return acc;
      }, {});
      return {
        ...initialState
      };
    }
  }

  onSubmit = e => {
    e.preventDefault();
    let formState = { ...this.state };
    if (this.props.onSubmit) {
      this.props.onSubmit(formState);
      this.setState({
        submitted: true
      });
    }
  };

  onChange = (e, key, type = 'single') => {
    if (type === 'single') {
      this.setState({
        [key]: e.target.value
      });
    } else {
      let found = this.state[key]
        ? this.state[key].find(d => d === e.target.value)
        : false;

      if (found) {
        let data = this.state[key].filter(d => {
          return d !== found;
        });
        this.setState({
          [key]: data
        });
      } else {
        let existing = this.state[key];
        let data = [e.target.value];
        if (existing) {
          data = [e.target.value, ...existing];
        }
        this.setState({
          [key]: data
        });
      }
    }
  };

  renderForm = () => {
    let model = this.props.model;
    let formUI = model.map(m => {
      let key = m.key;
      let type = m.type || 'text';
      let props = m.props || {};
      let name = m.name;

      let target = key;
      let value = this.state[target];
      let input = (
        <input
          {...props}
          type={type}
          key={m.key}
          name={name}
          value={value}
          onChange={e => {
            this.onChange(e, target);
          }}
        />
      );
      if (type === 'radio') {
        input = m.options.map(o => {
          let checked = o.value === value;
          return (
            <div key={'fr' + o.key} className="inline field">
              <input
                {...props}
                type={type}
                key={o.key}
                name={o.name}
                checked={checked}
                value={o.value}
                onChange={e => {
                  this.onChange(e, o.name);
                }}
              />
              <label key={'ll' + o.key}>{o.label}</label>
            </div>
          );
        });
      }

      if (type === 'select') {
        input = m.options.map(o => {
          // let checked = o.value === value;
          return (
            <option
              {...props}
              className="form-input"
              key={o.key}
              value={o.value}
            >
              {o.value}
            </option>
          );
        });
        input = (
          <select
            {...props}
            value={value}
            onChange={e => {
              this.onChange(e, m.key);
            }}
            className="ui fluid dropdown"
          >
            {input}
          </select>
        );
      }

      if (type === 'checkbox') {
        input = m.options.map(o => {
          let checked = o.value === value;
          if (value && value.length > 0) {
            checked = value.indexOf(o.value) > -1 ? true : false;
          }

          return (
            <div key={'cfr' + o.key} className="inline field">
              <input
                className="ui checkbox"
                {...props}
                type={type}
                key={o.key}
                name={o.name}
                checked={checked}
                value={o.value}
                onChange={e => {
                  this.onChange(e, m.key, 'multiple');
                }}
              />
              <label key={'ll' + o.key}>{o.label}</label>
            </div>
          );
        });
      }

      return (
        <div key={key} className="field">
          <label key={'l' + m.key} htmlFor={m.key}>
            {m.label}
          </label>
          {input}
        </div>
      );
    });
    return formUI;
  };
  render() {
    let title = this.props.title || 'Dynamic Form';
    return (
      <div>
        <form
          className="ui form"
          onSubmit={e => {
            this.onSubmit(e);
          }}
        >
          <h4 className="ui dividing header">{title}</h4>
          {this.renderForm()}
          <div>
            <button type="submit" className="ui button basic positive">
              Submit
            </button>
          </div>
        </form>
      </div>
    );
  }
}
