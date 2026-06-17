import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService implements OnModuleInit {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    onModuleInit(): Promise<void>;
    create(dto: CreateUserDto): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: number): Promise<User | null>;
    update(id: number, data: Partial<User>): Promise<User>;
}
