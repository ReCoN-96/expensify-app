import database from '../firebase/firebase';

// ADD_EXPENSE
export const addExpense = (expense) => ({
  type: 'ADD_EXPENSE',
  expense
});

export const startAddExpense = (expenseData = {}) => {
  return (dispatch, getState) => {
    const uid = getState().auth.uid;
    const {
      description = '',
      note = '',
      amount = 0,
      createdAt = 0
    } = expenseData;
    const expense = { description, note, amount, createdAt };

    return database.ref(`users/${uid}/expenses`).push(expense).then((ref) => {
      dispatch(addExpense({
        id: ref.key,
        ...expense
      }));
    });
  };
};

// REMOVE_EXPENSE
export const removeExpense = ({ id } = {}) => ({
  type: 'REMOVE_EXPENSE',
  id
});

export const startRemoveExpense = ({ id } = {}) => {
  return async (dispatch, getState) => {
    try {
      const uid = getState().auth.uid
      await database.ref(`users/${uid}/expenses/${id}`).remove()
      dispatch(removeExpense({ id }))
    } catch (e) {
      return console.log(e);
    };
  };
};

// EDIT_EXPENSE

export const editExpense = (id, updates) => ({
  type: 'EDIT_EXPENSE',
  id,
  updates
});

export const startEditExpense = (id, updates) => {
  return async (dispatch, getState) => {
    const uid = getState().auth.uid
    await database.ref(`users/${uid}/expenses/${id}`).update(updates)
    dispatch(editExpense(id, updates))
  };
};

// SET_EXPENSE
export const setExpenses = (expenses) => ({
  type: 'SET_EXPENSES',
  expenses
});

export const startSetExpenses = () => {
  return async (dispatch, getState) => {
    try {
      const uid = getState().auth.uid
      const dataSnapshot = await database.ref(`users/${uid}/expenses`).once('value');
      const expenses = [];
      dataSnapshot.forEach((childSnapshot) => {
        expenses.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      dispatch(setExpenses(expenses));
    } catch (e) {
      return console.log(e)
    };
  };
};

