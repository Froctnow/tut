import { SetMetadata } from "@nestjs/common";
import { Roles } from "src/enums/roles";

export const RolesAccess = (...roles: Roles[]) => SetMetadata("roles", roles);
