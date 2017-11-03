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
        verified:
          meteorUser &&
          meteorUser.emails &&
          meteorUser.emails.length > 0 &&
          meteorUser.emails[0].verified,
        roles: meteorUser && meteorUser.roles,
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
