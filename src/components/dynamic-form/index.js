import React from 'react';

export default class DynamicForm extends React.Component {
  state = {};
  // constructor(props) {
  //   super(props);
  // }

  static getDerivedStateFromProps(nextProps, prevState) {
    // console.log(nextProps);
    console.log(prevState);
    if (
      nextProps.defaultValues &&
      Object.keys(nextProps.defaultValues).length &&
      !prevState.id
    ) {
      console.log('yipee');
      return {
        ...nextProps.defaultValues
      };
    } else {
      console.log(nextProps.model);
      let initialState = nextProps.model.reduce((acc, m) => {
        let defaultVal = prevState[m.key] || '';
        acc[m.key] = m.value ? m.value : defaultVal;
        return acc;
      }, {});
      console.log('initialState: ', initialState);
      return {
        ...initialState
      };
    }
  }

  onSubmit = e => {
    e.preventDefault();
    let state = { ...this.state };
    if (this.props.onSubmit) {
      this.props.onSubmit(state);
    }
  };

  onChange = (e, key, type = 'single') => {
    if (type === 'single') {
      console.log(key, e.target.value);
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
    console.log(this.state);
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
            <React.Fragment key={'fr' + o.key}>
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
            </React.Fragment>
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
            <React.Fragment key={'cfr' + o.key}>
              <input
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
            </React.Fragment>
          );
        });
      }

      return (
        <div key={key}>
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
    console.log(this.state);
    let title = this.props.title || 'Dynamic Form';
    return (
      <div>
        <h3>{title}</h3>
        <form
          onSubmit={e => {
            this.onSubmit(e);
          }}
        >
          {this.renderForm()}
          <div>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    );
  }
}
