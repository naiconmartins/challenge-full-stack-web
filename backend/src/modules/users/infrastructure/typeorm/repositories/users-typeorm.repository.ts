import { ConflictError } from "@/common/domain/errors/conflict-error";
import { NotFoundError } from "@/common/domain/errors/not-found-error";

import {
  SearchInput,
  SearchOutput,
} from "@/common/domain/repositories/repository.interface";
import { UserModel } from "@/modules/users/domain/models/users.model";
import {
  CreateUserProps,
  UsersRepository,
} from "@/modules/users/domain/repositories/users.repository";
import { inject, injectable } from "tsyringe";
import { ILike, Repository } from "typeorm";
import { User } from "../entities/users.entity";

@injectable()
export class UsersTypeormRepository implements UsersRepository {
  sortableFields: string[] = ["name", "created_at"];

  constructor(
    @inject("UsersDefaultRepositoryTypeorm")
    private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<UserModel> {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundError(`User not found using email ${email}`);
    }
    return user;
  }

  async findByName(name: string): Promise<UserModel> {
    const user = await this.usersRepository.findOneBy({ name });
    if (!user) {
      throw new NotFoundError(`User not found using name ${name}`);
    }
    return user;
  }

  async conflictingEmail(email: string): Promise<void> {
    const user = await this.usersRepository.findOneBy({ email });
    if (user) {
      throw new ConflictError("Email already used on another user");
    }
  }

  create(props: CreateUserProps): UserModel {
    return this.usersRepository.create(props);
  }

  async insert(model: UserModel): Promise<UserModel> {
    return await this.usersRepository.save(model);
  }

  async findById(id: string): Promise<UserModel> {
    return this._get(id);
  }

  async update(model: UserModel): Promise<UserModel> {
    await this._get(model.id);
    await this.usersRepository.update({ id: model.id }, model);
    return model;
  }

  async delete(id: string): Promise<void> {
    await this._get(id);
    await this.usersRepository.delete(id);
  }

  async search(props: SearchInput): Promise<SearchOutput<UserModel>> {
    const validSort =
      props.sort != null && this.sortableFields.includes(props.sort);
    const dirOps = ["asc", "desc"];
    const validSortDir =
      props.sort_dir != null && dirOps.includes(props.sort_dir.toLowerCase());
    const orderByField = validSort ? (props.sort as string) : "created_at";
    const orderByDir = validSortDir ? (props.sort_dir as string) : "desc";

    const page = props.page ?? 1;
    const per_page = props.per_page ?? 15;

    const [users, total] = await this.usersRepository.findAndCount({
      ...(props.filter && {
        where: {
          name: ILike(`%${props.filter}%`),
        },
      }),
      order: {
        [orderByField]: orderByDir,
      },
      skip: (page - 1) * per_page,
      take: per_page,
    });

    return {
      items: users,
      per_page,
      total,
      current_page: page,
      sort: props.sort ?? null,
      sort_dir: props.sort_dir ?? null,
      filter: props.filter ?? null,
    };
  }

  protected async _get(id: string): Promise<UserModel> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundError(`User not found using ID ${id}`);
    }
    return user;
  }
}
