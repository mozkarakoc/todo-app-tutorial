import { spy } from 'sinon';
import { assert } from 'chai';

import TodoModel from './todoModel';

describe('TodoModel tests', () => {
  const model = new TodoModel('test');
  const onChange = spy();

  beforeEach(() => {
    onChange.resetHistory();
  });

  it('should create object', () => {
    assert.strictEqual(model.key, 'test');
  });

  it('should subscribe', () => {
    model.subscribe(onChange);
    assert.strictEqual(model.onChanges[0], onChange);
  });

  it('should inform', () => {
    model.inform();
    assert.strictEqual(onChange.callCount, 1);
  });

  it('should add todo', () => {
    model.addTodo('todo');
    model.addTodo('todo#2');
    assert.strictEqual(model.todos[0].title, 'todo');
    assert.strictEqual(model.todos[1].title, 'todo#2');
    assert.strictEqual(onChange.callCount, 2);
  });

  it('should toggle all', () => {
    model.toggleAll(true);
    assert.strictEqual(model.todos[0].completed, true);
    assert.strictEqual(onChange.callCount, 1);
  });

  it('should toggle single', () => {
    model.toggle(model.todos[0]);
    assert.strictEqual(model.todos[0].completed, false);
    assert.strictEqual(onChange.callCount, 1);
  });

  it('should destroy', () => {
    model.destroy(model.todos[0]);
    assert.strictEqual(model.todos.length, 1);
    assert.strictEqual(model.todos[0].title, 'todo#2');
    assert.strictEqual(onChange.callCount, 1);
  });

  it('should update', () => {
    model.addTodo('newTodo');
    model.save(model.todos[0], 'updated');
    assert.strictEqual(model.todos.length, 2);
    assert.strictEqual(model.todos[0].title, 'updated');
    assert.strictEqual(model.todos[1].title, 'newTodo');
    assert.strictEqual(onChange.callCount, 2);
  });

  it('should filter completed', () => {
    model.clearCompleted();
    assert.strictEqual(model.todos.length, 1);
    assert.strictEqual(model.todos[0].title, 'newTodo');
    assert.strictEqual(onChange.callCount, 1);
  });
});
