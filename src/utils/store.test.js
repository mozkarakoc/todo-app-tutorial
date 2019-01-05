import { assert, expect } from 'chai';
import { stub } from 'sinon';
import store from './store';

describe('store tests', () => {
  let getItem;
  let setItem;
  const storage = {};

  before(() => {
    // eslint-disable-next-line
    getItem = stub(localStorage, 'getItem').callsFake((namespace) => {
      return storage[namespace];
    });

    setItem = stub(localStorage, 'setItem').callsFake((namespace, data) => {
      storage[namespace] = data;
      return true;
    });
  });

  after(() => {
    setItem.restore();
    getItem.restore();
  });

  it('should get empty array whem namepsace not exists', () => {
    expect(store('test')).length(0);
  });

  it('should set to store', () => {
    assert.strictEqual(store('test', { foo: 'foo' }), true);
  });

  it('should get from store', () => {
    assert.strictEqual(store('test').foo, 'foo');
  });
});
