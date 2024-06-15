import { Injectable } from '@nestjs/common';

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
};

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'johnDoe@gmail.com',
      password: '123456',
      phone: '123456789',
    },
    {
      id: 2,
      name: 'Jane Doe',
      email: 'janeDoegmail.com',
      password: '123456',
      phone: '123456789',
    },
  ];

  async findOne(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }
}
