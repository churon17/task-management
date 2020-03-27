import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter-dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {

    constructor( 
        @InjectRepository(TaskRepository)
        private taskRepository : TaskRepository
    ){}

    async getTasks(filtedDto: GetTaskFilterDto, user : User) : Promise<Task[]>{  

        return this.taskRepository.getTasks(filtedDto, user);
    }

    async getTaskById(
        id:number,
        user : User
    ) : Promise<Task>{ 

        const foundTask = await this.taskRepository.findOne({ where : { id, userId : user.id} });

        if(!foundTask){
            throw new NotFoundException(`Task with ${id} not found`);
        }

        return foundTask;
    }

    async createTask(createTaskDto : CreateTaskDto, user : User) : Promise<Task>{
       return this.taskRepository.createTask(createTaskDto, user);
    }

    // async deleteTask(id: number) : Promise<Task>{

    //     const deleteTask : Task = await this.getTaskById(id);

    //     await this.taskRepository.remove(deleteTask);

    //     return deleteTask; 
    // }

    async optionalDeleteTask(
        id: number, 
        user : User
    ) : Promise<void>{

        // const deleteTask  = await this.taskRepository.delete({ description : 'Ecuador es un país de PAZ carajooo'});

        const deleteTask  = await this.taskRepository.delete({id, userId:  user.id});

        console.log(deleteTask);

        if(deleteTask.affected === 0){
            throw new NotFoundException(`Task with ${id} not found`);
        }

    }


    async updateTaskStatus(
        id:number, 
        status: TaskStatus, 
        user : User
    ) : Promise<Task>{
        
        const updatedTask : Task = await this.getTaskById(id, user);

        updatedTask.status = status;

        await updatedTask.save();

        return updatedTask;
    }

    // getAllTasks() : Task[]{
    //     return this.tasks;
    // }   

    // getTasksWithFilters(filterdto : GetTaskFilterDto) : Task[]{ 
        
    //     const { status, search } = filterdto;id

    //     let tasks = this.getAllTasks();

    //     console.log(search);

    //     if(status){
    //         tasks = tasks.filter(task => task.status === status);
    //     }
        
    //     if(search){
    //         tasks = tasks.filter(task => 
    //             task.title.includes(search) || 
    //             task.description.includes(search)
    //         );
    //     }

    //     return tasks;
    // }    

   
    
  
    
    // /**
    //  * Return the resource is a good Practice when 
    //  * we use Rest API. 
    //  */









}
