
import { db } from './dbService';
import { User, Role } from '../types';

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));

    const user = db.findUserByEmail(email);
    
    if (!user) throw new Error("User not found");
    if (user.password !== password) throw new Error("Invalid password");

    db.setSession(user);
    return user;
  },

  register: async (name: string, email: string, password: string): Promise<User> => {
    await new Promise(r => setTimeout(r, 800));

    const existing = db.findUserByEmail(email);
    if (existing) throw new Error("Email already exists");

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      password, 
      role: Role.USER,
      plan: 'starter',
      createdAt: new Date()
    };

    db.saveUser(newUser);
    db.setSession(newUser);
    return newUser;
  },

  logout: async () => {
    db.clearSession();
  },

  getCurrentUser: (): User | null => {
    return db.getSession();
  }
};
