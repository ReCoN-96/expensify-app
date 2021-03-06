import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  addExpense,
  editExpense,
  removeExpense,
  setExpenses,
  startAddExpense,
  startEditExpense,
  startRemoveExpense,
  startSetExpenses
} from '../../actions/expenses';
import expenses from '../fixtures/expenses';
import database from '../../firebase/firebase';
import 'regenerator-runtime/runtime';

const uid = 'testid';
const defaultAuthState = { auth: { uid } };
const createMockStore = configureMockStore([thunk]);

beforeEach((done) => {
  const expensesData = {};
  expenses.forEach(({ id, description, note, amount, createdAt }) => {
    expensesData[id] = { description, note, amount, createdAt };
  });
  database.ref(`users/${uid}/expenses`).set(expensesData).then(() => done());
});

test('should setup remove expense action object', () => {
  const action = removeExpense({ id: '123abc' });
  expect(action).toEqual({
    type: 'REMOVE_EXPENSE',
    id: '123abc'
  });
});

test('should setup edit expense action object', () => {
  const action = editExpense('123abc', { note: 'New note value' });
  expect(action).toEqual({
    type: 'EDIT_EXPENSE',
    id: '123abc',
    updates: {
      note: 'New note value'
    }
  });
});

test('should updates expense in firebase', async () => {
  const id = expenses[2].id;
  const updates = { description: 'updated', note: 'its run', amount: 10, createdAt: 5 };
  const store = createMockStore(defaultAuthState);
  await store.dispatch(startEditExpense(id, updates));
  const actions = store.getActions();
  expect(actions[0]).toEqual({
    type: 'EDIT_EXPENSE',
    id,
    updates
  });
  const snapshot = await database.ref(`users/${uid}/expenses/${id}`).once('value');
  expect(snapshot.val()).toEqual(updates);
});

test('should setup add expense action object with provided values', () => {
  const action = addExpense(expenses[2]);
  expect(action).toEqual({
    type: 'ADD_EXPENSE',
    expense: expenses[2]
  });
});

test('should add expense to database and store', async (done) => {
  const store = createMockStore(defaultAuthState);
  const expenseData = {
    description: 'Mouse',
    amount: 3000,
    note: 'This one is better',
    createdAt: 1000
  };

  await store.dispatch(startAddExpense(expenseData))

  const actions = store.getActions();
  expect(actions[0]).toEqual({
    type: 'ADD_EXPENSE',
    expense: {
      id: expect.any(String),
      ...expenseData
    }
  });
  const snapshot = await database.ref(`users/${uid}/expenses/${actions[0].expense.id}`).once('value');
  await expect(snapshot.val()).toEqual(expenseData);
  // done() -> force jest to wait 
  done();
});


test('should add expense with defaults to database and store', async (done) => {
  const expenseDefault = {
    description: '',
    note: '',
    amount: 0,
    createdAt: 0
  };
  const store = createMockStore(defaultAuthState);
  await store.dispatch(startAddExpense());
  const actions = store.getActions();
  expect(actions[0]).toEqual({
    type: 'ADD_EXPENSE',
    expense: {
      id: expect.any(String),
      ...expenseDefault
    }
  });
  const snapshot = await database.ref(`users/${uid}/expenses/${actions[0].expense.id}`).once('value');
  expect(snapshot.val()).toEqual({
    ...expenseDefault
  });
  // done() -> force jest to wait 
  done();
});

test('should setup set expense action object with data', () => {
  const action = setExpenses(expenses);
  expect(action).toEqual({
    type: 'SET_EXPENSES',
    expenses
  })
});

test('Should fetch the expenses from firebase', async (done) => {
  const store = createMockStore(defaultAuthState);
  await store.dispatch(startSetExpenses());
  const actions = store.getActions();
  expect(actions[0]).toEqual({
    type: 'SET_EXPENSES',
    expenses
  });
  done()
});

test('Should remove expense from firebase', async () => {
  const store = createMockStore({ auth: { uid } });
  const id = expenses[0].id
  await store.dispatch(startRemoveExpense(({ id })));
  const actions = store.getActions()
  expect(actions[0]).toEqual({
    type: 'REMOVE_EXPENSE',
    id
  })
  const snapshot = await database.ref(`users/${uid}/expenses/${id}`).once('value')
  expect(snapshot.exists()).toBeFalsy()
});
