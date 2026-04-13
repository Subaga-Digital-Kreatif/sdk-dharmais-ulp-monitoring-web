type User = {
  id: number;
  fullName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  initials: string;
};

type CreateUserRequest = {
  fullName: string;
  email: string;
  password: string;
};

type UpdateUserRequest = {
  fullName: string;
  email: string;
};