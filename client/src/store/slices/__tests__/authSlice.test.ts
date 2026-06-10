import authReducer, { login, logout, completeOnboarding } from '../authSlice';
import { User } from '../../../types';

describe('authSlice', () => {
  const initialState = {
    user: null as User | null,
    token: null as string | null,
    isAuthenticated: false,
    hasSeenOnboarding: false,
  };

  const mockUser: User = {
    id: '1',
    name: 'Test Admin',
    email: 'admin@test.com',
    role: 'admin',
  };

  it('should return the initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle login', () => {
    const action = login({ user: mockUser, token: 'fake-token' });
    const expectedState = {
      user: mockUser,
      token: 'fake-token',
      isAuthenticated: true,
      hasSeenOnboarding: true,
    };
    expect(authReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle logout', () => {
    const loggedInState = {
      user: mockUser,
      token: 'fake-token',
      isAuthenticated: true,
      hasSeenOnboarding: true,
    };
    const action = logout();
    const expectedState = {
      user: null,
      token: null,
      isAuthenticated: false,
      hasSeenOnboarding: true, // Should preserve onboarding status
    };
    expect(authReducer(loggedInState, action)).toEqual(expectedState);
  });

  it('should handle completeOnboarding', () => {
    const action = completeOnboarding();
    const expectedState = {
      ...initialState,
      hasSeenOnboarding: true,
    };
    expect(authReducer(initialState, action)).toEqual(expectedState);
  });
});
