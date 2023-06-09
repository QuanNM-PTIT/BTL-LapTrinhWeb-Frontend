"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useHeights;
var _vue = require("vue");
var _raf = _interopRequireDefault(require("../../_util/raf"));
function useHeights(mergedData, getKey, onItemAdd, onItemRemove) {
  var instance = new Map();
  var heights = new Map();
  var updatedMark = (0, _vue.ref)(Symbol('update'));
  (0, _vue.watch)(mergedData, function () {
    updatedMark.value = Symbol('update');
  });
  var collectRaf = undefined;
  function cancelRaf() {
    _raf.default.cancel(collectRaf);
  }
  function collectHeight() {
    cancelRaf();
    collectRaf = (0, _raf.default)(function () {
      instance.forEach(function (element, key) {
        if (element && element.offsetParent) {
          var offsetHeight = element.offsetHeight;
          if (heights.get(key) !== offsetHeight) {
            //changed = true;
            updatedMark.value = Symbol('update');
            heights.set(key, element.offsetHeight);
          }
        }
      });
    });
  }
  function setInstance(item, ins) {
    var key = getKey(item);
    var origin = instance.get(key);
    if (ins) {
      instance.set(key, ins.$el || ins);
      collectHeight();
    } else {
      instance.delete(key);
    }
    // Instance changed
    if (!origin !== !ins) {
      if (ins) {
        onItemAdd === null || onItemAdd === void 0 ? void 0 : onItemAdd(item);
      } else {
        onItemRemove === null || onItemRemove === void 0 ? void 0 : onItemRemove(item);
      }
    }
  }
  (0, _vue.onUnmounted)(function () {
    cancelRaf();
  });
  return [setInstance, collectHeight, heights, updatedMark];
}