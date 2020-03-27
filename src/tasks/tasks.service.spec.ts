import { Task } from './task.entity';
import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { GetTaskFilterDto } from './dto/get-tasks-filter-dto';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';
import { create } from 'domain';

const mockUser = {
    id : 12,
    username: 'Test User'
};


const mockTaskRepository = ()=> ({
    getTasks : jest.fn(),
    findOne : jest.fn(),
    createTask : jest.fn(),
    delete : jest.fn(),
});


describe('TaskService', ()=>{

    let taskService;
    let taskRepository;
    
    beforeEach(async()=>{
        
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide : TaskRepository, useFactory : mockTaskRepository},
            ]
        }).compile();

        taskService = await module.get<TasksService>(TasksService);

        taskRepository = await module.get<TaskRepository>(TaskRepository);
    });

    describe('getTasks', ()=>{

        it('get all tasks from the repository', async()=>{

            taskRepository.getTasks.mockResolvedValue('someValue');

            expect(taskRepository.getTasks).not.toHaveBeenCalled();

            const getTaskFilterDto : GetTaskFilterDto = {
                status : TaskStatus.OPEN,
                search : 'Some search query'
            }
            // Call TaskService 
            const result = await taskService.getTasks(getTaskFilterDto, mockUser);
            expect(taskRepository.getTasks).toHaveBeenCalled();

        });

    });


    describe('getTaskById', ()=>{

        it('calls taskRepository.findOne() and successfully retrieve and return the task', async()=> {

            const mockTask = {
                title : 'Test Task',
                description : 'Test description'
            }

            taskRepository.findOne.mockResolvedValue(mockTask);

            const result = await taskService.getTaskById(1, mockUser);

            expect(result).toEqual(mockTask);

            expect(taskRepository.findOne).toHaveBeenCalledWith({
               where : {
                   id : 1,
                   userId : mockUser.id,
               } 
            });
        });

        it('throws an error as task is not found', ()=>{

            taskRepository.findOne.mockResolvedValue(null);
            expect(taskService.getTaskById(1, mockUser)).rejects.toThrow(NotFoundException);

        });

    });

    describe('createTask', ()=>{
        
        it('calls taskRepository.create() and returns the result', async()=>{

            taskRepository.createTask.mockResolvedValue('someTask');

            expect(taskRepository.createTask).not.toHaveBeenCalled();
            
            const createTaskDto = {
                title : 'Test title',
                description : 'Test description'
            }
            
            const result = await taskService.createTask(createTaskDto, mockUser);
            expect(taskRepository.createTask).toHaveBeenCalledWith(createTaskDto, mockUser);
            expect(result).toEqual('someTask');


        });

    });

    describe('optionalDeleteTask', ()=>{

        it('calls taskRepository.delete() to delete a Task', async()=>{

           taskRepository.delete.mockResolvedValue({affected : 1});

           expect(taskRepository.delete).not.toHaveBeenCalled();

           await taskService.optionalDeleteTask(1, mockUser);

           expect(taskRepository.delete).toHaveBeenCalledWith({id : 1, userId: mockUser.id});
        });

        it('throws an error as task could not be found', ()=>{
            
            taskRepository.delete.mockResolvedValue({affected : 0});

            expect(taskService.optionalDeleteTask(1, mockUser)).rejects.toThrow(NotFoundException);
        });
    });

    describe('updateTaskStatus', ()=>{

        it('update a task status', async() => {

            const save = jest.fn().mockResolvedValue(true);

            taskService.getTaskById = jest.fn().mockResolvedValue({
                status : TaskStatus.OPEN,
                save,
            });

            expect(taskService.getTaskById).not.toHaveBeenCalled();
            expect(save).not.toHaveBeenCalled();
            const result = await taskService.updateTaskStatus(1, TaskStatus.DONE, mockUser);
            expect(taskService.getTaskById).toHaveBeenCalled();
            expect(save).toHaveBeenCalled();
            expect(result.status).toEqual(TaskStatus.DONE);
        });

    });


});
