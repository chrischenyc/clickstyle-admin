// --------- actions ----------
export function openModal(to, component, title) {
  return {
    type: 'OPEN_MODAL',
    to,
    component,
    title,
  };
}

export function closeModal() {
  return {
    type: 'CLOSE_MODAL',
  };
}

// --------- reducer ----------
const defaultState = {
  open: false,
  to: null,
  component: null,
  title: null,
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'OPEN_MODAL': {
      const { to, component, title } = action;

      return {
        ...state,
        open: true,
        to,
        component,
        title,
      };
    }

    case 'CLOSE_MODAL': {
      return {
        ...state,
        open: false,
        to: null,
        component: null,
        title: null,
      };
    }

    default:
      return state;
  }
};

export default reducer;
