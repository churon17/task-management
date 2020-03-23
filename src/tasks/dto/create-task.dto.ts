import {IsNotEmpty} from 'class-validator';

export class CreateTaskDto {
    
    @IsNotEmpty({
        message : 'El título no puede estar vacío'
    })
    title : string;
    
    @IsNotEmpty({
        message: 'La descripción no puede estar vacía'
    })
    description : string;
}

