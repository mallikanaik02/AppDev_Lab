import { render } from '@testing-library/react-native';
import AdminPanel from '../src/screens/admin/AdminPanel';
import { AuthContext } from '../src/contexts/AuthContext';

describe('AdminPanel', () => {
  test('hidden for non-admin users', () => {
    const { queryByText } = render(
      <AuthContext.Provider value={{ profile: { role: 'user' } }}>
        <AdminPanel />
      </AuthContext.Provider>
    );

    expect(queryByText(/Admin Panel/i)).toBeNull();
  });
});
