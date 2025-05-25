import { Role } from '../users.entity';

export class UserDto {
  id: string;
  email: string;
  userName: string;
  phone?: string;
  role: Role;
  isActive: boolean;

  constructor(user: Partial<UserDto>) {
    Object.assign(this, user);
  }
}
