import { NotFoundError } from "@/common/domain/errors/not-found-error";
import {
  SearchInput,
  SearchOutput,
} from "@/common/domain/repositories/repository.interface";
import { UserTokensModel } from "@/modules/users/domain/models/user-token.model";
import {
  CreateUserTokensProps,
  UserTokensRepository,
} from "@/modules/users/domain/repositories/user-tokens.repository";
import { UsersRepository } from "@/modules/users/domain/repositories/users.repository";

import { inject, injectable } from "tsyringe";
import { ILike, Repository } from "typeorm";

@injectable()
export class UserTokensTypeormRepository implements UserTokensRepository {
  sortableFields: string[] = ["created_at"];

  constructor(
    @inject("UserTokensDefaultRepositoryTypeorm")
    private userTokensRepository: Repository<UserTokensModel>,
    @inject("UsersRepository")
    private usersRepository: UsersRepository,
  ) {}

  create(props: CreateUserTokensProps): UserTokensModel {
    return this.userTokensRepository.create(props);
  }

  async insert(model: UserTokensModel): Promise<UserTokensModel> {
    return this.userTokensRepository.save(model);
  }

  async findById(id: string): Promise<UserTokensModel> {
    return this._get(id);
  }

  async update(model: UserTokensModel): Promise<UserTokensModel> {
    await this._get(model.id);
    await this.userTokensRepository.update({ id: model.id }, model);
    return model;
  }

  async delete(id: string): Promise<void> {
    await this._get(id);
    await this.userTokensRepository.delete(id);
  }

  async search(props: SearchInput): Promise<SearchOutput<UserTokensModel>> {
    const validSort =
      props.sort != null && this.sortableFields.includes(props.sort);
    const dirOps = ["asc", "desc"];
    const validSortDir =
      props.sort_dir != null && dirOps.includes(props.sort_dir.toLowerCase());
    const orderByField = validSort ? (props.sort as string) : "created_at";
    const orderByDir = validSortDir ? (props.sort_dir as string) : "desc";

    const page = props.page ?? 1;
    const per_page = props.per_page ?? 15;

    const [userTokens, total] = await this.userTokensRepository.findAndCount({
      ...(props.filter && {
        where: {
          user_id: ILike(`%${props.filter}%`),
        },
      }),
      order: {
        [orderByField]: orderByDir,
      },
      skip: (page - 1) * per_page,
      take: per_page,
    });

    return {
      items: userTokens,
      per_page,
      total,
      current_page: page,
      sort: props.sort ?? null,
      sort_dir: props.sort_dir ?? null,
      filter: props.filter ?? null,
    };
  }

  async generate(props: CreateUserTokensProps): Promise<UserTokensModel> {
    const user = await this.usersRepository.findById(props.user_id);
    const userToken = this.userTokensRepository.create({
      user_id: user.id,
    });
    return this.userTokensRepository.save(userToken);
  }

  async findByToken(token: string): Promise<UserTokensModel> {
    const userToken = await this.userTokensRepository.findOneBy({
      token,
    });
    if (!userToken) {
      throw new NotFoundError("User token not found");
    }
    return userToken;
  }

  protected async _get(id: string): Promise<UserTokensModel> {
    const userToken = await this.userTokensRepository.findOneBy({ id });
    if (!userToken) {
      throw new NotFoundError(`User token not found using ID ${id}`);
    }
    return userToken;
  }
}
