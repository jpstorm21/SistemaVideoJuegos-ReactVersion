import React from 'react';
import ReactDOM from 'react-dom';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { select } from '../styles';
import { withStyles, Chip, FormControl, InputLabel, Select, OutlinedInput,
  Input, MenuItem, FormHelperText
  } from '@material-ui/core';

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 48 * 4.5 + 8,
      width: 250,
    },
  },
};

@observer
class CustomSelect extends React.Component {
  @observable pageState = {}

  constructor (props) {
    super(props);

    this.pageState = {
      labelWidth: 0,
      value: 0
    }
  }
  componentDidMount () {
    this.pageState.labelWidth = ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth;
  }

  render () {
    const {
      classes,
      id,
      name,
      label,
      options,
      value,
      onChange,
      placeholder,
      error,
      helperText,
      multiple,
      withBorder,
      readOnly,
      margin,
      disabled,
      fullWidth
    } = this.props;

    return (
      <FormControl
        variant={withBorder ? 'outlined' : 'standard'}
        className={classes.formControl}
        fullWidth={fullWidth}
        error={error}
      >
        <InputLabel ref={ref=>{this.InputLabelRef=ref}} htmlFor={id}>{label}</InputLabel>
        <Select
          multiple={multiple}
          value={value}
          onChange={onChange}
          fullWidth={fullWidth}
          disabled={disabled}
          margin={margin}
          input={
            withBorder 
            ? <OutlinedInput fullWidth={fullWidth} id={id} name={name} labelWidth={this.pageState.labelWidth} readOnly={readOnly}/>
            : <Input fullWidth={fullWidth} id={id} name={name} readOnly={readOnly}/>
          }
          
          renderValue={ !multiple ? (selected) => {
            let obj = options.find((e)=>{return e.id==selected})
            if(!obj)
              return null;
            return obj.name;
          } : (selected) => {
            return (<div className={classes.chips}>
              {selected.map(v => {
                let obj = options.find((e)=>{return e.id==v})

                if(!obj)
                  return null;

                return (
                <Chip 
                  key={v}
                  className={classes.chip}
                  label={obj.name}
                />)
              }
              )}
            </div>)
          }}
          MenuProps={MenuProps}
        >
          {!multiple && <MenuItem value=""><em>{placeholder}</em></MenuItem>}
          {options.map(row => (
            <MenuItem key={row.id} value={row.id}>{row.name}</MenuItem>
          ))}
        </Select>
        {helperText && <FormHelperText error>{helperText}</FormHelperText> }
      </FormControl>
    );
  }
}

CustomSelect.defaultProps = {
  id: '',
  name: '',
  label: 'Select',
  placeholder: 'Seleccione...',
  helperText: false,
  multiple: false,
  fullWidth: false,
  readOnly: false,
  disabled: false,
  margin: "normal",
  error: false
};

export default withStyles(select)(CustomSelect);