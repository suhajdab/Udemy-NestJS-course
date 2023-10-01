import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { isNumber } from 'class-validator';

/*
  NOTE: Service is responsible for handling business logic
*/

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {
    this.repo = repo;
  }

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  findOne(id: number) {
    if (!isNumber(id)) {
      return null;
    }
    return this.repo.findOneBy({ id });
  }

  findByEmail(email: string) {
    return this.repo.find({ where: { email } });
  }

  findAll() {
    return this.repo.find();
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.repo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    Object.assign(user, attrs);
    // not repo.insert or repo.update because these don't trigger hooks on entities
    return await this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.repo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    // not repo.delete because this doesn't trigger hooks on entities
    return await this.repo.remove(user);
  }
}
