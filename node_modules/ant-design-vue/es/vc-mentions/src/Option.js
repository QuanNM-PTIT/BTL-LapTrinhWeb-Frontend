import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { defineComponent } from 'vue';
export var optionProps = {
  value: String,
  disabled: Boolean,
  label: [String, Number, Function]
};
export var optionOptions = {
  name: 'Option',
  props: optionProps,
  render: function render(_props, _ref) {
    var _slots$default;
    var slots = _ref.slots;
    return (_slots$default = slots.default) === null || _slots$default === void 0 ? void 0 : _slots$default.call(slots);
  }
};
export default defineComponent(_objectSpread({
  compatConfig: {
    MODE: 3
  }
}, optionOptions));