import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter-dto';

@Injectable()
export class TasksService {

    private tasks : Task[] = [];

    getTaskById(id: string) : Task{
        const foundTask = this.tasks.find(task=> task.id === id);
        
        if(!foundTask){
            throw new NotFoundException(`Task with id ${id} not found `);
        }

        return foundTask;
    }

    getAllTasks() : Task[]{
        return this.tasks;
    }   

    getTasksWithFilters(filterdto : GetTaskFilterDto) : Task[]{ 
        
        const { status, search } = filterdto;

        let tasks = this.getAllTasks();

        console.log(search);

        if(status){
            tasks = tasks.filter(task => task.status === status);
        }
        
        if(search){
            tasks = tasks.filter(task => 
                task.title.includes(search) || 
                task.description.includes(search)
            );
        }

        return tasks;
    }    

    /**
     * This method help to create a new task. 
     * @param title 
     * @param description 
     */
    createTask(createTaskDto : CreateTaskDto) : Task{

        const {title, description} = createTaskDto;

        const task : Task = {
            id: uuid(),
            title,
            description,
            status : TaskStatus.OPEN
        };

        this.tasks.push(task);

        return task;
    }

    deleteTask(id: string) : Task{

        const deleteTask = this.getTaskById(id);

        this.tasks = this.tasks.filter(task => task.id !== deleteTask.id);

        return deleteTask; 
    }
    
    updateTask(id : string, status: TaskStatus) : Task{

        const updateTask : Task = this.getTaskById(id);

        updateTask.status = status;

        return updateTask;
    }
    
    /**
     * Return the resource is a good Practice when 
     * we use Rest API. 
     */









}
