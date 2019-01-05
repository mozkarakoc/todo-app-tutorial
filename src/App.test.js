import React from 'react';
import { shallow, mount } from 'enzyme';
import { assert } from 'chai';
import TodoItem from './components/todoItem';
import TodoFooter from './components/todoFooter';
import {
  ALL_TODOS, COMPLETED_TODOS, ACTIVE_TODOS, ENTER_KEY, ESCAPE_KEY,
} from './types/constants';
import TodoModel from './types/todoModel';

import App from './App';

describe('App tests', () => {
  let model = new TodoModel('test');

  it('should render a <div>', () => {
    const wrapper = shallow(<App model={model} />);
    assert.strictEqual(wrapper.type(), 'div', 'component render a div');
  });

  it('should render a heading inside div', () => {
    const wrapper = shallow(<App model={model} />);
    assert.strictEqual(wrapper.find('h1').text(), 'todos');
  });

  it('should render a input inside div', () => {
    const wrapper = shallow(<App model={model} />);
    const input = wrapper.findWhere(x => x.hasClass('new-todo'));
    assert.strictEqual(input.type(), 'input');
    assert.strictEqual(input.props().placeholder, 'What needs to be done?');
  });

  describe('render todos', () => {
    before(() => {
      model = new TodoModel('test');
      model.addTodo('test');
    });

    it('should render todos inside section', () => {
      const wrapper = shallow(<App model={model} />);
      const section = wrapper.findWhere(x => x.hasClass('main'));
      assert.strictEqual(section.type(), 'section');
    });

    it('should section has toggle elements', () => {
      const wrapper = shallow(<App model={model} />);
      const input = wrapper.findWhere(x => x.hasClass('toggle-all'));
      assert.strictEqual(input.type(), 'input');
      assert.strictEqual(input.hasClass('toggle-all'), true);
    });

    it('should render TodoItem', () => {
      const wrapper = shallow(<App model={model} />);
      const todoItem = wrapper.find(TodoItem).first();
      assert.strictEqual(todoItem.props().todo.title, 'test');
    });

    it('should render TodoFooter', () => {
      const wrapper = shallow(<App model={model} />);
      const todoFooter = wrapper.find(TodoFooter).first();
      assert.strictEqual(todoFooter.props().count, 1);
    });
  });

  describe('new todos', () => {
    it('should handle change on new todo', () => {
      const wrapper = shallow(<App model={model} />);
      const input = wrapper.findWhere(x => x.hasClass('new-todo'));
      input.simulate('change', { target: { value: 'newTodo' } });
      assert.strictEqual(wrapper.state().newTodo, 'newTodo');
    });

    it('should handle add new todo', () => {
      const wrapper = shallow(<App model={model} />);
      const input = wrapper.findWhere(x => x.hasClass('new-todo'));
      input.simulate('change', { target: { value: 'newTodo' } });
      input.simulate('keyDown', { keyCode: ENTER_KEY });
      assert.strictEqual(wrapper.state().newTodo, '');
      assert.strictEqual(model.todos[model.todos.length - 1].title, 'newTodo');
    });

    it('should handle cancel new todo', () => {
      const wrapper = shallow(<App model={model} />);
      const input = wrapper.findWhere(x => x.hasClass('new-todo'));
      input.simulate('change', { target: { value: 'newTodo' } });
      input.simulate('keyDown', { keyCode: ESCAPE_KEY });
      assert.strictEqual(wrapper.state().newTodo, 'newTodo');
    });
  });

  describe('events', () => {
    before(() => {
      model = new TodoModel('test');
      model.addTodo('test');
    });

    it('should handle filtering', () => {
      const wrapper = mount(<App model={model} />);
      const footer = wrapper.find(TodoFooter);
      let link = footer.findWhere(x => x.type() === 'a' && x.text() === 'Active');
      link.simulate('click');
      assert.strictEqual(wrapper.state().nowShowing, ACTIVE_TODOS);
      link = footer.findWhere(x => x.type() === 'a' && x.text() === 'Completed');
      link.simulate('click');
      assert.strictEqual(wrapper.state().nowShowing, COMPLETED_TODOS);
      link = footer.findWhere(x => x.type() === 'a' && x.text() === 'All');
      link.simulate('click');
      assert.strictEqual(wrapper.state().nowShowing, ALL_TODOS);
    });

    it('should handle item toggle', () => {
      const wrapper = mount(<App model={model} />);
      const footer = wrapper.find(TodoItem);
      const link = footer.findWhere(x => x.type() === 'input' && x.hasClass('toggle'));
      link.simulate('change', model.todos[0]);
      assert.strictEqual(model.todos[0].completed, true);
    });

    it('should handle item destroy', () => {
      model.addTodo('todo#2');
      const wrapper = mount(<App model={model} />);
      const todoItem = wrapper.find(TodoItem).first();
      const button = todoItem.findWhere(x => x.type() === 'button' && x.hasClass('destroy'));
      button.simulate('click', model.todos[0]);
      assert.strictEqual(model.todos.length, 1);
      assert.strictEqual(model.todos[0].title, 'todo#2');
    });

    it('should handle item editing', () => {
      const wrapper = mount(<App model={model} />);
      const todoItem = wrapper.find(TodoItem).first();
      const label = todoItem.findWhere(x => x.type() === 'label' && x.text() === 'todo#2');
      label.simulate('doubleClick');
      assert.strictEqual(wrapper.state().editing, model.todos[0].id);
    });

    it('should handle item update', () => {
      const wrapper = mount(<App model={model} />);
      const todoItem = wrapper.find(TodoItem).first();
      const label = todoItem.findWhere(x => x.type() === 'label' && x.text() === 'todo#2');
      const input = todoItem.findWhere(x => x.type() === 'input' && x.hasClass('edit'));
      label.simulate('doubleClick');
      input.simulate('change', { target: { value: 'editedText' } });
      input.simulate('keyDown', { which: ENTER_KEY });
      assert.strictEqual(model.todos[0].title, 'editedText');
    });

    it('should handle item edit cancel', () => {
      const wrapper = mount(<App model={model} />);
      const todoItem = wrapper.find(TodoItem).first();
      const label = todoItem.findWhere(x => x.type() === 'label' && x.text() === 'editedText');
      const input = todoItem.findWhere(x => x.type() === 'input' && x.hasClass('edit'));
      label.simulate('doubleClick');
      input.simulate('change', { target: { value: 'cancelText' } });
      input.simulate('keyDown', { which: ESCAPE_KEY });
      assert.strictEqual(model.todos[0].title, 'editedText');
    });

    it('should toggle all', () => {
      const wrapper = mount(<App model={model} />);
      const input = wrapper.findWhere(x => x.hasClass('toggle-all'));
      input.simulate('change', { target: { checked: true } });
      model.todos.forEach((todo) => {
        assert.strictEqual(todo.completed, true);
      });
    });

    it('should handle clear completed', () => {
      before(() => {
        model = new TodoModel('test');
        model.addTodo('test');
        model.addTodo('test#2');
        model.toggle('test');
      });

      const wrapper = mount(<App model={model} />);
      const footer = wrapper.find(TodoFooter).first();
      const button = footer.find('button');
      button.simulate('click');
      model.todos.forEach((todo) => {
        assert.strictEqual(todo.completed, false);
      });
    });
  });
});
