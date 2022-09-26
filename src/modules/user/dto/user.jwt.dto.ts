import RoleEntity from "src/database/entities/Role";

export class UserJwtDto {
  id: string;

  email: string;

  firstName: string;

  lastName?: string;

  displayName: string;

  roles: RoleEntity[];
}
