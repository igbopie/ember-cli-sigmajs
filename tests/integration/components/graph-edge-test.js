import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import GraphEdge from 'ember-cli-sigmajs/components/graph-edge';
import SigmaGraph from 'ember-cli-sigmajs/components/sigma-graph';
import Ember from 'ember';

let graphEdge;
let sigmaGraph;
let onerror;

module('graph-edge', 'Integration | Component | graph edge', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    onerror = Ember.onerror;
    this.owner.register('component:graph-edge', GraphEdge.extend({
      init() {
        this._super(...arguments);
        graphEdge = this;
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
    await render(hbs`{{#graph-edge}}{{/graph-edge}}`);

    assert.ok(myError.message.match(/Assertion Failed: Tried to use .* outside the context of a parent component\./), );
  });

  test('it renders with sigma-graph parent', async function(assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`{{#sigma-graph}}
                      {{#graph-node id="n0" label="hello" x=0 y=0 size=1 color="#f00"}}
                      {{/graph-node}}
                      {{#graph-edge id="e0" source="n0" target="n1"}}
                      {{/graph-edge}}
                    {{/sigma-graph}}`);

    assert.equal(this.element.textContent.trim(), '');

    // Template block usage:
    await render(hbs`
      {{#sigma-graph}}
        {{#graph-node id="n0" label="hello" x=0 y=0 size=1 color="#f00"}}
        {{/graph-node}}
        {{#graph-edge id="e0" source="n0" target="n1"}}
          template block text
        {{/graph-edge}}
      {{/sigma-graph}}
    `);

    assert.equal(this.element.textContent.trim(), 'template block text');
  });

  test('edge attributes updated', async function(assert) {
    this.set('color', '#f00');
    await render(hbs`
      {{#sigma-graph}}
        {{#graph-node id="n0" label="hello" x=0 y=0 size=1 color="#000"}}
        {{/graph-node}}
        {{#graph-node id="n1" label="world" x=1 y=1 size=1 color="#a00"}}
        {{/graph-node}}
        {{#graph-edge id="e0" source="n0" target="n1" color=color}}
        {{/graph-edge}}
      {{/sigma-graph}}
    `);
    assert.equal(sigmaGraph.graphModel().edges(graphEdge.id).color, '#f00');
    this.set('color', '#f0f');
    assert.equal(sigmaGraph.graphModel().edges(graphEdge.id).color, '#f0f');
  });
});