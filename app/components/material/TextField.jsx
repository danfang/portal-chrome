import React, { Component, PropTypes } from 'react';
import NativeListener from 'react-native-listener';

class TextField extends Component {
  getInput() {
    return this._input;
  }
  focus() {
    this._input.focus();
  }
  render() {
    const { onKeyUp, disabled, label, inputId } = this.props;
    return (
      <div { ...this.props } className="mdl-textfield mdl-js-textfield">
        <NativeListener onKeyUp={onKeyUp}>
          <input
            id={inputId}
            ref={r => this._input = r}
            className="mdl-textfield__input"
            type="text"
            disabled={disabled}
          />
        </NativeListener>
        <label className="mdl-textfield__label" htmlFor={inputId}>{ label }</label>
      </div>
    );
  }
}

TextField.propTypes = {
  onKeyUp: PropTypes.func.isRequired,
  inputId: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
};

export default TextField;
