import { render } from '@testing-library/react-native';
import VIPContent from '../src/screens/main/vip/VIPContent';
import { AuthContext } from '../src/contexts/AuthContext';

describe('VIP content gating', () => {
  test('renders VIP content only if premium true', () => {
    const { getByText, queryByText, rerender } = render(
      <AuthContext.Provider value={{ profile: { premium: true } }}>
        <VIPContent />
      </AuthContext.Provider>
    );
    expect(getByText(/VIP Content/i)).toBeTruthy();

    rerender(
      <AuthContext.Provider value={{ profile: { premium: false } }}>
        <VIPContent />
      </AuthContext.Provider>
    );
    expect(queryByText(/VIP Content/i)).toBeNull();
  });
});
