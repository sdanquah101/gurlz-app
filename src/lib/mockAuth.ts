// Mock user database
const users = [
  {
    id: '1',
    email: 'demo@example.com',
    password: '1234567890',
    username: 'Demo User',
    gender: 'female' as const,
    country: 'GH',
    phoneNumber: '+233123456789',
    dateJoined: new Date('2024-01-01'),
    type: 'individual' as const
  }
];

export const mockAuth = {
  login: async (email: string, password: string) => {
    // Allow any email/password combination for testing
    const user = users.find(u => u.email === email) || {
      id: String(Date.now()),
      email,
      username: email.split('@')[0],
      gender: 'female' as const,
      country: 'GH',
      phoneNumber: '',
      dateJoined: new Date(),
      type: 'individual' as const
    };

    return {
      token: 'mock-jwt-token',
      user
    };
  },

  register: async (data: any) => {
    const newUser = {
      id: String(Date.now()),
      ...data,
      dateJoined: new Date()
    };
    users.push(newUser);

    return {
      token: 'mock-jwt-token',
      user: newUser
    };
  },

  getProfile: async () => {
    return users[0];
  }
};