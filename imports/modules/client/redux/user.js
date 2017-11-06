// --------- actions ----------
export function userSignedIn(meteorUser) {
  return {
    type: 'USER_SIGNED_IN',
    meteorUser,
  };
}

export function userSignedOut() {
  return {
    type: 'USER_SIGNED_OUT',
  };
}

// --------- reducer ----------
const defaultState = {
  authenticated: localStorage.getItem('Meteor.userId') !== null,
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'USER_SIGNED_IN': {
      const { meteorUser } = action;

      return {
        ...state,
        authenticated: meteorUser && true,
        id: meteorUser && meteorUser._id,
      };
    }

    case 'USER_SIGNED_OUT': {
      return {
        authenticated: false,
      };
    }

    default:
      return state;
  }
};

export default reducer;
