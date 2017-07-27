import Ember from 'ember';
import { ParentMixin } from 'ember-composability-tools';
/*global sigma */

export default Ember.Component.extend(ParentMixin, {

  attributeBindings: ['sigmaInst', 'settings', 'batchData', 'rendererType', 'rendererSettings', 'camera'],

  classNames: ['sigma-graph'],

  settings: {},

  rendererType: 'canvas',

  rendererSettings: {},

  sigma: function() {
    return this._sigma;
  },

  graphModel: function() {
    return this.sigma().graph;
  },

  events: ['clickNode',
          'rightClickNode',
          'overNode',
          'doubleClickNode',
          'outNode',
          'downNode',
          'upNode',
          'clickEdge',
          'rightClickEdge',
          'overEdge',
          'doubleClickEdge',
          'outEdge',
          'downEdge',
          'upEdge',
          'click',
          'rightClick',
          'clickStage',
          'doubleClickStage',
          'rightClickStage',
          'clickNodes',
          'doubleClickNodes',
          'rightClickNodes',
          'overNodes',
          'outNodes',
          'downNodes',
          'upNodes'],

  _bindEvents: function() {
    this.get('events').forEach((eventName) => {
      if (this.get(eventName) !== undefined) {
        this.sigma().bind(eventName, this.get(eventName));
      }
    });
  },

  _addSigmaInst: function(sigmaInst, renderer) {
    this._sigma = sigmaInst;
    this._sigma.addRenderer(renderer);
  },

  didInsertParent: function() {
    const { sigmaInst, element, settings, batchData, rendererType, rendererSettings, camera } = this;
    let options = {
      renderer: {
        container: element,
        type: rendererType,
        settings: rendererSettings,
        camera: camera
      },
      settings: settings
    }
    if (batchData) {
      options['graph'] = batchData;
    }
    try {
      if (sigmaInst) {
          this._addSigmaInst(sigmaInst, options.renderer);
      }
      else {
          this._sigma = new sigma(options);
      }
    }
    catch(e) {
      Ember.Logger.error(e);
    }
    this._bindEvents();
    this._super(...arguments);
    this.sigma().refresh();
  },

  willDestroyParent: function() {
    this._super(...arguments);
    this._unbindEvents();
    this.sigma().kill();
    delete this.sigma();
  },

  _unbindEvents: function() {
    this.get('events').forEach((eventName) => {
      this.sigma().unbind(eventName);
    });
  }
});
