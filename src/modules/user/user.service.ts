import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import RoleEntity from "src/database/entities/Role";
import UserEntity from "src/database/entities/User";
import { Repository } from "typeorm";
import { UserModel } from "./models/user";
import { sign } from "jsonwebtoken";
import { doInParallel } from "src/utils";
import { Roles } from "src/enums/roles";
import { TokensModel } from "./models/tokens";
import crypto from "crypto";
import { v4 as uuid } from "uuid";
import { UserRelations } from "src/enums/relations";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
  ) {}

  async regSocialNetwork(userDto: UserModel, roles: Roles[]): Promise<TokensModel> {
    const user = await this.userRepository.findOne({ externalId: userDto.externalId }, { relations: ["roles"] });

    if (user) {
      userDto.externalId = undefined;

      return { jwt: this.generateJWT({ id: user.id, ...userDto }, user.roles) };
    } else {
      const { user: newUser, roles: rolesEntity } = await this.create(userDto, roles);

      return { jwt: this.generateJWT(newUser, rolesEntity) };
    }
  }

  async authSocialNetwork(user: UserEntity, userDto: UserModel): Promise<TokensModel> {
    userDto.externalId = undefined;

    return { jwt: this.generateJWT(userDto, user.roles) };
  }

  async authPassword(userDto: Pick<UserModel, "password" | "email">): Promise<TokensModel> {
    const passwordHash = crypto.createHash("md5").update(userDto.password).digest("hex");
    const [user] = await this.userRepository.find({ where: { email: userDto.email, password: passwordHash }, relations: [UserRelations.roles] });

    if (!user) throw new HttpException("Email or password incorrect", HttpStatus.BAD_REQUEST);

    return { jwt: this.generateJWT(user, user.roles) };
  }

  async create(userDto: UserModel, roles: Roles[]): Promise<{ user: UserEntity; roles: RoleEntity[] }> {
    if (userDto.password) {
      if (userDto.password.length < 8) throw new HttpException("Password must has minimum 8 length", HttpStatus.BAD_REQUEST);

      userDto.password = crypto.createHash("md5").update(userDto.password).digest("hex");
    }

    const user = await this.userRepository.save(this.userRepository.create({ ...userDto }));
    const rolesEntity: RoleEntity[] = [];

    await doInParallel(roles, role => {
      const newRole = this.roleRepository.create({ name: role, user });

      rolesEntity.push(newRole);

      return this.roleRepository.save(newRole);
    });

    return { user, roles: rolesEntity };
  }

  generateJWT(userDto: Omit<UserModel, "externalId">, roles: RoleEntity[]) {
    return sign({ ...userDto, roles }, process.env.JWT_PRIVATE_KEY);
  }

  async getToken(email: string) {
    const user = await this.userRepository.findOne({ where: { email }, relations: ["roles"] });

    return this.generateJWT(user, user.roles);
  }

  async getUserById(userId: string) {
    return await this.userRepository.findOne(userId);
  }

  async generateVerifyToken(userId: string) {
    const token = crypto.createHash("md5").update(uuid()).digest("hex");

    await this.userRepository.update(userId, { verifyToken: token });

    return token;
  }

  async registerVerify(verifyToken: string): Promise<TokensModel> {
    const [user] = await this.userRepository.find({ where: { verifyToken }, relations: [UserRelations.roles] });

    if (!user) throw new HttpException("Verify code incorrect", HttpStatus.BAD_REQUEST);

    user.verifyToken = null;

    await this.userRepository.save(user);

    return { jwt: this.generateJWT(user, user.roles) };
  }

  async deleteUser(userId: string): Promise<void> {
    await this.userRepository.delete(userId);
  }
}
