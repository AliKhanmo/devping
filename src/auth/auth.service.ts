import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from 'src/users/user.schema';
import { UsersService } from 'src/users/users.service';
import { RegisterResponseDto } from './dto/register.response.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async register(email: string, password: string): Promise<RegisterResponseDto> {
        const hash = await bcrypt.hash(password, 10);
        const user = await this.usersService.create({ email, password: hash });
        return { id: user._id.toString(), email: user.email };
    }

    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.usersService.findByEmail(email);
        if (!user) return null;

        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) return null;

        return user;
    }

    async login(user) {
        const payload = { email: user.email, userId: user.id };
        return {
            accessToken: await this.jwtService.signAsync(payload, {
                secret: process.env.JWT_SECRET,
                expiresIn: '2h',
            }),
        };
    }
}
