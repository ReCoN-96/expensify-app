import React from 'react';
import { ExpensesSummary } from '../../components/ExpensesSummary';
import { shallow } from 'enzyme';

test('Should correctly render ExpensesSummary with 1 expense', () => {
  const wrapper = shallow(<ExpensesSummary totalAmountExpenses={1} sumOfExpenses={85} />)
  expect(wrapper).toMatchSnapshot();
});

test('Should correctly render ExpenssesSummary with multiple expenses', () => {
  const wrapper = shallow(<ExpensesSummary totalAmountExpenses={25} sumOfExpenses={855} />)
  expect(wrapper).toMatchSnapshot();
});