import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import GraphNode from 'ember-cli-sigmajs/components/graph-node';
import SigmaGraph from 'ember-cli-sigmajs/components/sigma-graph';
import Ember from 'ember';

let graphNode;
let sigmaGraph;
let onerror;

module('graph-node', 'Integration | Component | graph node', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    onerror = Ember.onerror;
    this.owner.register('component:graph-node', GraphNode.extend({
      init() {
        this._super(...arguments);
        graphNode = this;
      }
    }));

    this.owner.register('component:sigma-graph', SigmaGraph.extend({
      init() {
        this._super(...arguments);
        sigmaGraph = this;
      }
    }));
  });

  hooks.afterEach(function() {
    Ember.onerror = onerror;
  });

  test('cannot be rendered without sigma-graph parent', async function(assert) {
    let myError;
    Ember.onerror = (e) => myError =e;
    await render(hbs`{{#graph-node}}{{/graph-node}}`);

    assert.ok(myError.message.match(/Assertion Failed: Tried to use .* outside the context of a parent component\./), );
  });

  test('it renders with sigma-graph parent', async function(assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`{{#sigma-graph}}
                      {{#graph-node id="n0" label="hello" x=0 y=0 size=1 color="#f00"}}
                      {{/graph-node}}
                    {{/sigma-graph}}`);

    assert.equal(this.element.textContent.trim(), '');

    // Template block usage:
    await render(hbs`
      {{#sigma-graph}}
        {{#graph-node id="n0" label="hello" x=0 y=0 size=1 color="#f00"}}
          template block text
        {{/graph-node}}
      {{/sigma-graph}}
    `);

    assert.equal(this.element.textContent.trim(), 'template block text');
  });

  test('node attributes updated', async function(assert) {
    this.set('color', '#f00');
    await render(hbs`
      {{#sigma-graph}}
        {{#graph-node id="n0" label="hello" x=0 y=0 size=1 color=color}}
        {{/graph-node}}
      {{/sigma-graph}}
    `);
    assert.equal(sigmaGraph.graphModel().nodes(graphNode.id).color, '#f00');
    this.set('color', '#f0f');
    assert.equal(sigmaGraph.graphModel().nodes(graphNode.id).color, '#f0f');
  });
});
