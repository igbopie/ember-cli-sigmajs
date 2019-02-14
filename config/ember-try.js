/* eslint-env node */
module.exports = {
  useYarn: true,
  scenarios: [
    {
      name: 'ember-3.0',
      npm: {
        devDependencies: {
          'ember-source': '^3.0.0'
        }
      }
    },
    {
      name: 'ember-release',

      npm: {
        devDependencies: {
          'ember-source': 'latest'
        }
      }
    },
    {
      name: 'ember-beta',
      npm: {
        devDependencies: {
          'ember-source': 'beta'
        }
      }
    },
    {
      name: 'ember-default',
      npm: {
        devDependencies: {}
      }
    }
  ]
};
