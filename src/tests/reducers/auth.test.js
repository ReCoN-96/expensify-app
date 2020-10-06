import authReducer from '../../reducers/auth';

test('Should return the good data expected with login action', () => {
  const action = {
    type: 'LOGIN',
    uid: 'testid'
  };
  const state = authReducer({}, action)
  expect(state).toEqual({ uid: 'testid' })
});

test('Should return clear data for logout', () => {
  const action = {
    type: 'LOGIN',
  };
  const state = authReducer({ uid: 'lmao' }, action)
  expect(state).toEqual({})
});