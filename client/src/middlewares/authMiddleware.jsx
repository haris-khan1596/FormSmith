export const authMiddleware = store => next => action => {
    const { isAuthenticated } = store.getState().auth;
  
    if (action.type === 'NAVIGATE_TO_PROTECTED_ROUTE' && !isAuthenticated) {
      // Redirect user to login if not authenticated
      action.payload.navigate('/login');
    }
  
    return next(action);
  };
   