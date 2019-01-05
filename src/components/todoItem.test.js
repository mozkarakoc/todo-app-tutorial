import React from 'react';
import { shallow, mount } from 'enzyme';
import { spy } from 'sinon';
import { assert } from 'chai';
import classNames from 'classnames';

import TodoItem from './todoItem';
import { ENTER_KEY, ESCAPE_KEY } from '../types/constants';

describe('TodoItem tests', () => {
  const todo = {
    id: 'id',
    title: 'test',
    completed: false,
  };

  it('should render a <li>', () => {
    const className = classNames({
      completed: false,
      editing: false,
    });

    const wrapper = shallow(<TodoItem todo={todo} />);
    assert.strictEqual(wrapper.type(), 'li', 'component render a li');
    assert.strictEqual(wrapper.hasClass(className), true);
  });

  it('should mount and update', () => {
    const onToggle = spy();
    const wrapper = mount(<TodoItem todo={todo} onToggle={onToggle} />);
    wrapper.setProps({ editing: true });
  });

  describe('prop: onSave, onDestroy, onCancel', () => {
    it('should render a input', () => {
      const wrapper = shallow(<TodoItem todo={todo} />);
      const input = wrapper.findWhere(x => x.hasClass('edit'));
      assert.strictEqual(input.type(), 'input');
    });

    it('should handle item changed', () => {
      const onSave = spy();
      const wrapper = shallow(<TodoItem todo={todo} onSave={onSave} />);
      const input = wrapper.findWhere(x => x.hasClass('edit'));
      wrapper.setState({ editText: 'changed' });
      input.simulate('blur');
      assert.strictEqual(onSave.args[0][0], 'changed');
    });

    it('should handle item deleted', () => {
      const onDestroy = spy();
      const wrapper = shallow(<TodoItem todo={todo} onDestroy={onDestroy} />);
      const input = wrapper.findWhere(x => x.hasClass('edit'));
      wrapper.setState({ editText: '' });
      input.simulate('blur');
      assert.strictEqual(onDestroy.callCount, 1);
    });

    it('should handle editing cancelled', () => {
      const onCancel = spy();
      const wrapper = shallow(<TodoItem todo={todo} onCancel={onCancel} />);
      const input = wrapper.findWhere(x => x.hasClass('edit'));
      input.simulate('keyDown', { which: ESCAPE_KEY });
      assert.strictEqual(onCancel.callCount, 1);
      assert.strictEqual(onCancel.args[0][0].which, ESCAPE_KEY);
    });

    it('should handle editing submitted', () => {
      const onSave = spy();
      const wrapper = shallow(<TodoItem todo={todo} onSave={onSave} />);
      const input = wrapper.findWhere(x => x.hasClass('edit'));
      wrapper.setState({ editText: 'newText' });
      input.simulate('keyDown', { which: ENTER_KEY });
      assert.strictEqual(onSave.callCount, 1);
      assert.strictEqual(onSave.args[0][0], 'newText');
    });

    it('should handle input change', () => {
      const wrapper = shallow(<TodoItem todo={todo} editing />);
      const input = wrapper.findWhere(x => x.hasClass('edit'));
      input.simulate('change', { target: { value: 'changedValue' } });
      assert.strictEqual(wrapper.state().editText, 'changedValue');
    });
  });

  describe('prop: onEdit', () => {
    it('should render a label', () => {
      const wrapper = shallow(<TodoItem todo={todo} />);
      const label = wrapper.find('label');
      assert.strictEqual(label.text(), todo.title);
    });

    it('should handle item double clicked', () => {
      const onEdit = spy();
      const wrapper = shallow(<TodoItem todo={todo} onEdit={onEdit} />);
      const label = wrapper.find('label');
      label.simulate('doubleClick');
      assert.strictEqual(onEdit.callCount, 1);
      assert.strictEqual(wrapper.state().editText, todo.title);
    });
  });
});
