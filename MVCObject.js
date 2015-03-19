// Generated by CoffeeScript 1.9.1

/**
 * An implementation of Google Maps' MVCObject
 */

(function() {
  var Accessor, MVCObject,
    hasProp = {}.hasOwnProperty;

  MVCObject = (function() {
    var capitalize, getGetterName, getSetterName, getUid, getterNameCache, setterNameCache, triggerChange, uid;

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


    /**
     * @description 获取当前对象中给对应key对应的set方法
     * @param {String} key 关键字
     * @return {void}
     */

    getSetterName = function(key) {
      if (setterNameCache.hasOwnProperty(key)) {
        return setterNameCache[key];
      } else {
        return setterNameCache[key] = "set" + (capitalize(key));
      }
    };


    /**
     * @description  是传入的字符串首字母大写
     * @param {String} str 初始值
     * @return {String}  首字符大写后的结果值
     */

    capitalize = function(str) {
      return str.substr(0, 1).toUpperCase() + str.substr(1);
    };


    /**
     * @description  获取uid
     * @param {Object} obj 要获取uid 的对象
     * @return {Number}
     */

    getUid = function(obj) {
      return obj.__uid__ || (obj.__uid__ = ++uid);
    };


    /**
     * @description 这个函数的触发需要时机
     * 在一个key所在的终端对象遍历到时触发
     * 同时传播给所有直接、间接监听targetKey的对象
     * 在调用MVCObject的set方法时开始遍历
     *
     * @param target {MVCObject} 继承了MVCObject的对象
     * @param targetKey {String} 当前对象中被监听的字段
     * @return {void}
     *
     */

    triggerChange = function(target, targetKey) {
      var base, bindingObj, bindingUid, evt, ref, results;
      evt = targetKey + "_changed";

      /**
       * 优先检测并执行目标对象key对应的响应方法
       * 其次检测并执行默认方法
       */
      if (target[evt]) {
        target[evt]();
      } else {
        if (typeof target.changed === "function") {
          target.changed(targetKey);
        }
      }
      target.__bindings__ || (target.__bindings__ = {});
      (base = target.__bindings__)[targetKey] || (base[targetKey] = {});
      ref = target.__bindings__[targetKey];
      results = [];
      for (bindingUid in ref) {
        if (!hasProp.call(ref, bindingUid)) continue;
        bindingObj = ref[bindingUid];
        results.push(triggerChange(bindingObj.target, bindingObj.targetKey));
      }
      return results;
    };


    /**
     * @description 从依赖链中获取对应key的值
     * @param {String} key 关键值
     * @return {String} 对应的值
     */

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
        if (accessor.to) {
          value = accessor.to(value);
        }
      } else if (this.hasOwnProperty(key)) {
        value = this[key];
      }
      return value;
    };


    /**
     * @description set方法遍历依赖链直到找到key的持有对象设置key的值;
     * 有三个分支
     * @param {String} key 关键值
     * @param {all} value 要给key设定的值,可以是所有类型
     * @return {void}
     */

    MVCObject.prototype.set = function(key, value) {
      var accessor, setterName, target, targetKey;
      this.__accessors__ || (this.__accessors__ = {});
      if (this.__accessors__.hasOwnProperty(key)) {
        accessor = this.__accessors__[key];
        targetKey = accessor.targetKey;
        target = accessor.target;
        setterName = getSetterName(targetKey);
        if (accessor.from) {
          value = accessor.from(value);
        }
        if (target[setterName]) {
          return target[setterName](value);
        } else {
          return target.set(targetKey, value);
        }
      } else {
        this[key] = value;
        return triggerChange(this, key);
      }
    };


    /**
     * @description 没个MVCObject对象各自的响应对应的key值变化时的逻辑
     */

    MVCObject.prototype.changed = function() {};


    /**
     * @description 手动触发对应key的事件传播
     * @param {String} key 关键值
     * @return {void}
     */

    MVCObject.prototype.notify = function(key) {
      var accessor, target, targetKey;
      this.__accessors__ || (this.__accessors__ = {});
      if (this.__accessors__.hasOwnProperty(key)) {
        accessor = this.__accessors__[key];
        targetKey = accessor.targetKey;
        target = accessor.target;
        return target.notify(targetKey);
      } else {
        return triggerChange(this, key);
      }
    };

    MVCObject.prototype.setValues = function(values) {
      var key, results, setterName, value;
      results = [];
      for (key in values) {
        if (!hasProp.call(values, key)) continue;
        value = values[key];
        setterName = getSetterName(key);
        if (this[setterName]) {
          results.push(this[setterName](value));
        } else {
          results.push(this.set(key, value));
        }
      }
      return results;
    };


    /**
     * @description 将当前对象的一个key与目标对象的targetKey建立监听和广播关系
     * @param key {String} 当前对象上的key
     * @param target {Object} 目标对象
     * @param tarrgetKey {String} 目标对象上的key
     * @param noNotify {Boolean}
     */

    MVCObject.prototype.bindTo = function(key, target, targetKey, noNotify) {
      var accessor, base, binding;
      targetKey || (targetKey = key);
      this.unbind(key);
      this.__accessors__ || (this.__accessors__ = {});
      target.__bindings__ || (target.__bindings__ = {});
      (base = target.__bindings__)[targetKey] || (base[targetKey] = {});
      binding = new Accessor(this, key);
      accessor = new Accessor(target, targetKey);
      this.__accessors__[key] = accessor;
      target.__bindings__[targetKey][getUid(this)] = binding;
      if (!noNotify) {
        triggerChange(this, key);
      }
      return accessor;
    };


    /**
     * @description 解除当前对象上key与目标对象的监听
     * @param {String} key 关键字
     * @return {void}
     */

    MVCObject.prototype.unbind = function(key) {
      var accessor, target, targetKey;
      this.__accessors__ || (this.__accessors__ = {});
      accessor = this.__accessors__[key];
      if (accessor) {
        target = accessor.target;
        targetKey = accessor.targetKey;
        this[key] = this.get(key);
        delete target.__bindings__[targetKey][getUid(this)];
        return delete this.__accessors__[key];
      }
    };

    MVCObject.prototype.unbindAll = function() {
      var key, ref, results;
      this.__accessors__ || (this.__accessors__ = {});
      ref = this.__accessors__;
      results = [];
      for (key in ref) {
        if (!hasProp.call(ref, key)) continue;
        results.push(this.unbind(key));
      }
      return results;
    };

    return MVCObject;

  })();

  Accessor = (function() {
    function Accessor(target1, targetKey1) {
      this.target = target1;
      this.targetKey = targetKey1;
    }

    Accessor.prototype.transform = function(from, to) {
      this.from = from;
      this.to = to;
      return this.target.notify(this.targetKey);
    };

    return Accessor;

  })();

  if (typeof module !== "undefined" && module !== null) {
    module.exports = MVCObject;
  } else if (typeof define === 'function') {
    define(function() {
      return MVCObject;
    });
  } else {
    window.MVCObject = MVCObject;
  }

}).call(this);
