"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.optionProps = exports.optionOptions = exports.default = void 0;
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _vue = require("vue");
var optionProps = {
  value: String,
  disabled: Boolean,
  label: [String, Number, Function]
};
exports.optionProps = optionProps;
var optionOptions = {
  name: 'Option',
  props: optionProps,
  render: function render(_props, _ref) {
    var _slots$default;
    var slots = _ref.slots;
    return (_slots$default = slots.default) === null || _slots$default === void 0 ? void 0 : _slots$default.call(slots);
  }
};
exports.optionOptions = optionOptions;
var _default = (0, _vue.defineComponent)((0, _objectSpread2.default)({
  compatConfig: {
    MODE: 3
  }
}, optionOptions));
exports.default = _default;