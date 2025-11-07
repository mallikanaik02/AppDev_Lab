import { render } from '@testing-library/react-native';
import Upsell from '../src/screens/main/vip/UPSsell';
import { AuthContext } from '../src/contexts/AuthContext';

describe('Upsell visibility', () => {
  test('Upsell shown only to non-premium users', () => {
    const { getByText, queryByText, rerender } = render(
      <AuthContext.Provider value={{ profile: { premium: false } }}>
        <Upsell />
      </AuthContext.Provider>
    );
    expect(getByText(/Upgrade to VIP/i)).toBeTruthy();

    rerender(
      <AuthContext.Provider value={{ profile: { premium: true } }}>
        <Upsell />
      </AuthContext.Provider>
    );
    expect(queryByText(/Upgrade to VIP/i)).toBeNull();
  });
});
