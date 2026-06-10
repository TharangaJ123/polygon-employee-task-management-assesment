import themeReducer, { setThemeMode } from '../themeSlice';

describe('themeSlice', () => {
  const initialState = {
    mode: 'system' as 'light' | 'dark' | 'system',
  };

  it('should return initial state', () => {
    expect(themeReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setThemeMode to light', () => {
    const action = setThemeMode('light');
    const nextState = themeReducer(initialState, action);
    expect(nextState.mode).toBe('light');
  });

  it('should handle setThemeMode to dark', () => {
    const state = { mode: 'light' as 'light' | 'dark' };
    const action = setThemeMode('dark');
    const nextState = themeReducer(state, action);
    expect(nextState.mode).toBe('dark');
  });
});
