import { IsString, MinLength, MaxLength, Matches } from "class-validator";

export class AuthCredentialsDto {
    
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username:  string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message : 'Asegurese que su contraseña sea segura'
    })
    password : string;
}