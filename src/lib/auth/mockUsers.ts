import { User, UserType } from '../../types/auth';

let users: User[] = [
  {
    id: '1',
    email: 'demo@example.com',
    username: 'Demo User',
    gender: 'female',
    country: 'GH',
    phoneNumber: '+233123456789',
    dateJoined: new Date('2024-01-01'),
    type: 'individual'
  }
];

export const mockUsers = {
  findOrCreate: (email: string, type: UserType = 'individual'): User => {
    let user = users.find(u => u.email === email);
    
    if (!user) {
      user = {
        id: String(Date.now()),
        email,
        username: email.split('@')[0],
        gender: 'female',
        country: 'GH',
        phoneNumber: '',
        dateJoined: new Date(),
        type
      };
      users.push(user);
    }
    
    return user;
  },
  
  add: (user: User) => {
    users.push(user);
    return user;
  },
  
  getAll: () => [...users]
};