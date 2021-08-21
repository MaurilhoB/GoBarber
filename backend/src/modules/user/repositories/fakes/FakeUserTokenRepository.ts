import IUserTokensRepository from '../IUserTokensRepository';
import UserToken from '@modules/user/infra/typeorm/entities/UserToken';
import { v4 as uuid } from 'uuid';

class FakeUserTokenRepository implements IUserTokensRepository {
  private userTokens: UserToken[] = [];

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      user_id,
      created_at: new Date(Date.now()),
      updated_at: new Date(Date.now()),
    });

    this.userTokens.push(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = this.userTokens.find(
      findToken => findToken.token === token
    );

    return userToken;
  }
}

export default FakeUserTokenRepository;
