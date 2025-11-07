import { render } from '@testing-library/react';
import Upsell from '../components/Upsell';
import { AuthContext } from '../contexts/AuthContext';

describe('Upsell visibility', () => {
  test('shown only to non-premium users', () => {
    const { getByText, queryByText, rerender } = render(
      <AuthContext.Provider value={{ profile: { premium: false } }}>
        <Upsell />
      </AuthContext.Provider>
    );
    expect(getByText(/Upgrade to VIP/i)).toBeInTheDocument();

    rerender(
      <AuthContext.Provider value={{ profile: { premium: true } }}>
        <Upsell />
      </AuthContext.Provider>
    );
    expect(queryByText(/Upgrade to VIP/i)).toBeNull();
  });
});
