import React from 'react';
import { shallow } from 'enzyme';
import { spy } from 'sinon';
import { assert } from 'chai';

import TodoFooter from './todoFooter';
import { ALL_TODOS, COMPLETED_TODOS, ACTIVE_TODOS } from '../types/constants';

describe('TodoFooter tests', () => {
  it('should render a <footer> element with "footer" classs', () => {
    const wrapper = shallow(<TodoFooter />);
    assert.strictEqual(wrapper.type(), 'footer', 'component render a footer');
    assert.strictEqual(wrapper.hasClass('footer'), true, 'component has class footer');
  });

  describe('prop: count', () => {
    it('should render todo count inside the footer', () => {
      const wrapper = shallow(<TodoFooter count={1} />);
      const span = wrapper.childAt(0);

      assert.strictEqual(span.hasClass('todo-count'), true);
      assert.strictEqual(span.text(), '1 item left');
    });

    it('should handle pluralize with count', () => {
      const wrapper = shallow(<TodoFooter count={2} />);
      const span = wrapper.childAt(0);

      assert.strictEqual(span.hasClass('todo-count'), true);
      assert.strictEqual(span.text(), '2 items left');
    });
  });

  describe('prop: handleFiltering', () => {
    it('should render a filtering area', () => {
      const wrapper = shallow(<TodoFooter />);
      const filterArea = wrapper.findWhere(x => x.hasClass('filters'));
      assert.strictEqual(filterArea.type(), 'ul');
    });

    it('should handle filtering', () => {
      const handleFiltering = spy();
      const wrapper = shallow(<TodoFooter handleFiltering={handleFiltering} />);
      const filterArea = wrapper.findWhere(x => x.hasClass('filters'));
      const filterType = [ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS];
      filterArea.find('a').forEach((child, index) => {
        child.simulate('click');
        assert.strictEqual(handleFiltering.callCount, 1);
        assert.strictEqual(handleFiltering.args[0][0], filterType[index]);
        handleFiltering.resetHistory();
      });
    });
  });

  describe('prop: completedCount', () => {
    it('should render clear button', () => {
      const wrapper = shallow(<TodoFooter count={3} completedCount={1} />);
      const button = wrapper.findWhere(x => x.hasClass('clear-completed'));
      assert.strictEqual(button.type(), 'button');
    });

    it('should handle clear button clicked', () => {
      const onClearCompleted = spy();
      const wrapper = shallow((
        <TodoFooter onClearCompleted={onClearCompleted} count={3} completedCount={1} />
      ));
      const button = wrapper.findWhere(x => x.hasClass('clear-completed'));
      button.simulate('click');
      assert.strictEqual(onClearCompleted.callCount, 1);
    });
  });
});
