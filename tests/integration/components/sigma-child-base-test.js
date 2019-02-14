import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

let onerror;
module('sigma-child-base', 'Integration | Component | sigma child base', function(hooks) {
  setupRenderingTest(hooks);
  hooks.beforeEach(function() {
    onerror = Ember.onerror;
  });

  hooks.afterEach(function() {
    Ember.onerror = onerror;
  });

  test('cannot be rendered without sigma-graph parent', async function(assert) {
    let myError;
    Ember.onerror = (e) => myError = e;
    await render(hbs`{{#sigma-child-base}}{{/sigma-child-base}}`);

    assert.ok(myError.message.match(/Assertion Failed: Tried to use .* outside the context of a parent component\./), );
  });
});
