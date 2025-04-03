export class User {
  email: string;
  password: string;
  name: string;
  id: number;

  constructor(email: string, password: string, name: string, id: number) {
    this.email = email;
    this.password = password;
    this.name = name;
    this.id = id;
  }
}
