import { assert } from 'chai';
import extend from './extend';

describe('extend tests', () => {
  it('should extends', () => {
    const newObj = extend({ foo: 'foo' }, { bar: 'bar' });
    assert.strictEqual(newObj.foo, 'foo');
    assert.strictEqual(newObj.bar, 'bar');
  });
});
