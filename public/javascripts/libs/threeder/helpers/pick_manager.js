define(['../services/graphics/graphics_service'], function(Graphics) {
  var PickManager;
  return PickManager = {
    handleMouseMove: function(event) {
      var oldObj, picker, pickers, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2, _results, _results1;
      if (this.clickedObject) {
        pickers = this.clickedObject.pickers;
        _results = [];
        for (_i = 0, _len = pickers.length; _i < _len; _i++) {
          picker = pickers[_i];
          if (picker.enabled && picker.onMouseMove) {
            _results.push(picker.onMouseMove(event));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      } else {
        oldObj = this.overObject;
        this.overObject = this.objectFromMouse(event);
        if (oldObj !== this.overObject) {
          if (oldObj) {
            Graphics._instance.setCursor(null);
            event.type = 'mouseout';
            _ref = oldObj.pickers;
            for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
              picker = _ref[_j];
              if (picker.enabled && picker.onMouseOut) {
                picker.onMouseOut(event);
              }
            }
          }
          if (this.overObject) {
            event.type = 'mouseout';
            _ref1 = this.overObject.pickers;
            for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
              picker = _ref1[_k];
              if (picker.enabled && picker.overCursor) {
                Graphics.instace.setCursor(picker.overCursor);
              }
              if (picker.enabled && picker.onMouseOver) {
                picker.onMouseOver(event);
              }
            }
          }
        }
        if (this.overObject) {
          _ref2 = this.overObject.pickers;
          _results1 = [];
          for (_l = 0, _len3 = _ref2.length; _l < _len3; _l++) {
            picker = _ref2[_l];
            if (picker.enabled && picker.moveWithoutCapture && picker.onMouseMove) {
              event.type = 'mousemove';
              _results1.push(picker.onMouseMove(event));
            } else {
              _results1.push(void 0);
            }
          }
          return _results1;
        }
      }
    },
    handleMouseDown: function(event) {
      var picker, _i, _len, _ref, _results;
      this.clickedObject = this.objectFromMouse(event);
      if (this.clickedObject) {
        _ref = this.clickedObject.pickers;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          picker = _ref[_i];
          if (picker.enabled && picker.onMouseDown) {
            _results.push(picker.onMouseDown(event));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    },
    handleMouseUp: function(event) {
      var overobject, picker, _i, _len, _ref;
      if (this.clickedObject) {
        overobject = this.objectFromMouse(event);
        _ref = this.clickedObject.pickers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          picker = _ref[_i];
          if (picker.enabled && picker.onMouseUp) {
            picker.onMouseUp(event);
            if (overobject === this.clickedObject) {
              event.type = 'click';
              picker.onMouseClick(event);
            }
          }
        }
      }
      return this.clickedObject = null;
    },
    handleMouseClick: function(event) {
      var picker, _i, _len, _ref;
      this.clickedObject = this.objectFromMouse(event);
      if (this.clickedObject) {
        _ref = this.clickedObject.pickers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          picker = _ref[_i];
          if (picker.enabled && picker.onMouseClick) {
            picker.onMouseClick(event);
          }
        }
      }
      return this.clickedObject = null;
    },
    handleMouseDoubleClick: function(event) {
      var picker, _i, _len, _ref;
      this.clickedObject = this.objectFromMouse(event);
      if (this.clickedObject) {
        _ref = this.clickedObject.pickers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          picker = _ref[_i];
          if (picker.enabled && picker.onMouseDoubleClick) {
            picker.onMouseDoubleClick(event);
          }
        }
      }
      return this.clickedObject = null;
    },
    handleMouseScroll: function(event) {
      var picker, _i, _len, _ref, _results;
      if (this.overObject) {
        _ref = this.overObject.pickers;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          picker = _ref[_i];
          if (picker.enabled && picker.onMouseScroll) {
            _results.push(picker.onMouseScroll(event));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    },
    objectFromMouse: function(event) {
      var intersected, picker, _i, _len, _ref;
      intersected = Graphics._instance.objectFromMouse(event);
      if (intersected.object) {
        event.face = intersected.face;
        event.normal = intersected.normal;
        event.point = intersected.point;
        event.object = intersected.object;
        if (intersected.object._entity.pickers) {
          _ref = intersected.object._entity.pickers;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            picker = _ref[_i];
            if (picker.enabled) {
              return intersected.object._entity;
            }
          }
        }
        return this.findObjectPicker(event, intersected.hitPointWorld, intersected.object.object);
      } else {
        return null;
      }
    },
    findObjectPicker: function(event, hitPointWorld, object) {
      var modelMat, picker, _i, _len, _ref;
      while (object) {
        if (object.data && object.data._entity.pickers) {
          _ref = object.data._entity.pickers;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            picker = _ref[_i];
            if (picker.enabled) {
              modelMat = new THREE.Matrix4();
              modelMat = getInverse(object.matrixWorld);
              event.point = hitPointWorld.clone();
              event.point.applyMatrix4(modelMat);
              return object.data._entity;
            }
          }
        }
        object = object.parent;
      }
      return null;
    },
    clickedObject: null,
    overObject: null
  };
});
