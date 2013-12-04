// Generated by CoffeeScript 1.6.3
/**
 * An implementation of Google Maps' MVCObject
*/


(function() {
  var MVCObject;

  MVCObject = (function() {
    var capitalize, getGetterName, getSetterName, getUid, getterNameCache, invokeChange, setterNameCache, uid;

    function MVCObject() {}

    getterNameCache = {};

    setterNameCache = {};

    uid = 0;

    getGetterName = function(key) {
      if (getterNameCache.hasOwnProperty(key)) {
        return getterNameCache[key];
      } else {
        return getterNameCache[key] = "get" + (capitalize(key));
      }
    };

    getSetterName = function(key) {
      if (setterNameCache.hasOwnProperty(key)) {
        return setterNameCache[key];
      } else {
        return setterNameCache[key] = "set" + (capitalize(key));
      }
    };

    capitalize = function(str) {
      return str.substr(0, 1).toUpperCase() + str.substr(1);
    };

    getUid = function(obj) {
      return obj.__uid__ || (obj.__uid__ = ++uid);
    };

    invokeChange = function(target, targetKey) {
      var bindingName, bindingObj, evt, _base, _ref, _results;
      evt = "" + targetKey + "_changed";
      if (target[evt]) {
        target[evt]();
      } else {
        if (typeof target.changed === "function") {
          target.changed(targetKey);
        }
      }
      target.__bindings__ || (target.__bindings__ = {});
      (_base = target.__bindings__)[targetKey] || (_base[targetKey] = {});
      _ref = target.__bindings__[targetKey];
      _results = [];
      for (bindingName in _ref) {
        bindingObj = _ref[bindingName];
        _results.push(invokeChange(bindingObj.target, bindingObj.targetKey));
      }
      return _results;
    };

    MVCObject.prototype.get = function(key) {
      var accessor, getterName, target, targetKey, value;
      this.__accessors__ || (this.__accessors__ = {});
      if (this.__accessors__.hasOwnProperty(key)) {
        accessor = this.__accessors__[key];
        targetKey = accessor.targetKey;
        target = accessor.target;
        getterName = getGetterName(targetKey);
        if (target[getterName]) {
          value = target[getterName]();
        } else {
          value = target.get(targetKey);
        }
      } else if (this.hasOwnProperty(key)) {
        value = this[key];
      }
      return value;
    };

    MVCObject.prototype.set = function(key, value) {
      var accessor, setterName, target, targetKey;
      this.__accessors__ || (this.__accessors__ = {});
      if (this.__accessors__.hasOwnProperty(key)) {
        accessor = this.__accessors__[key];
        targetKey = accessor.targetKey;
        target = accessor.target;
        setterName = getSetterName(targetKey);
        if (target[setterName]) {
          return target[setterName](value);
        } else {
          return target.set(targetKey, value);
        }
      } else {
        this[key] = value;
        return invokeChange(this, key);
      }
    };

    MVCObject.prototype.notify = function(key) {
      var accessor, target, targetKey;
      this.__accessors__ || (this.__accessors__ = {});
      if (this.__accessors__.hasOwnProperty(key)) {
        accessor = this.__accessors__[key];
        targetKey = accessor.targetKey;
        target = accessor.target;
        return target.notify(targetKey);
      } else {
        return invokeChange(this, key);
      }
    };

    MVCObject.prototype.setValues = function(values) {
      var key, setterName, value, _results;
      _results = [];
      for (key in values) {
        value = values[key];
        setterName = getSetterName(key);
        if (this[setterName]) {
          _results.push(this[setterName](value));
        } else {
          _results.push(this.set(key, value));
        }
      }
      return _results;
    };

    MVCObject.prototype.bindTo = function(key, target, targetKey, noNotify) {
      var accessor, bindingObj, _base;
      targetKey || (targetKey = key);
      this.unbind(key);
      this.__accessors__ || (this.__accessors__ = {});
      target.__bindings__ || (target.__bindings__ = {});
      (_base = target.__bindings__)[targetKey] || (_base[targetKey] = {});
      bindingObj = {
        target: this,
        targetKey: key
      };
      accessor = {
        target: target,
        targetKey: targetKey,
        bindingObj: bindingObj
      };
      this.__accessors__[key] = accessor;
      target.__bindings__[targetKey][getUid(bindingObj)] = bindingObj;
      if (!noNotify) {
        return invokeChange(this, key);
      }
    };

    MVCObject.prototype.unbind = function(key) {
      var accessor, bindingObj, target, targetKey;
      this.__accessors__ || (this.__accessors__ = {});
      accessor = this.__accessors__[key];
      if (accessor) {
        bindingObj = accessor.bindingObj;
        target = accessor.target;
        targetKey = accessor.targetKey;
        if (bindingObj) {
          delete target.__bindings__[targetKey][getUid(bindingObj)];
        }
        this[key] = this.get(key);
        return delete this.__accessors__[key];
      }
    };

    MVCObject.prototype.unbindAll = function() {
      var key, _results;
      this.__accessors__ || (this.__accessors__ = {});
      _results = [];
      for (key in this.__accessors__) {
        _results.push(this.unbind(key));
      }
      return _results;
    };

    return MVCObject;

  })();

  if (typeof module !== "undefined" && module !== null) {
    module.exports = MVCObject;
  } else {
    window.MVCObject = MVCObject;
  }

}).call(this);
