import { PipeTransform, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { TaskStatus, Task } from '../task.model';

export class TaskStatusValidationPipe implements PipeTransform{

    readonly allowedStatuses = [
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DONE
    ];

    transform(value : any, metadata: ArgumentMetadata){
        
        value = value.toUpperCase();

        if( !this.isStatusValid(value)){
            throw new BadRequestException(`${value} is not a valid status`);
        }

        return value;
    }

    private isStatusValid(status : any) : boolean{

        return this.allowedStatuses.includes(status);

    }

}