import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import AppRouter from './routers/AppRouter';
import configureStore from './store/configureStore';
import { addExpense } from './actions/expenses';
// import { setTextFilter } from './actions/filters';
// import getVisibleExpenses from './selectors/expenses';
import 'normalize.css/normalize.css';
import './styles/styles.scss';
import 'react-dates/lib/css/_datepicker.css'

const store = configureStore();

store.dispatch(addExpense({ description: 'Water bill', amount: 2500, createdAt: 2004 }));
store.dispatch(addExpense({ description: 'Gas bill', amount: 1000, createdAt: 2005 }));
store.dispatch(addExpense({ description: 'Rent', amount: 40000, createdAt: 2004 }));
store.dispatch(addExpense({ description: 'facture dupond', amount: 2000, createdAt: 2020 }));

const jsx = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
)

ReactDOM.render(jsx, document.getElementById('app'));