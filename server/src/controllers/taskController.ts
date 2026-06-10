import { type Request, type Response } from 'express';
import { TaskService } from '../services/TaskService.js';
import { type TaskStatus } from '../models/Task.js';

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role, userId } = req.user!;
    let tasks;

    if (role === 'admin') {
      tasks = await TaskService.getAllTasks();
    } else {
      tasks = await TaskService.getTasksByAssignee(userId);
    }

    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, assignee_id } = req.body;
    const creator_id = req.user!.userId;

    if (!title) {
      res.status(400).json({ message: 'Title is required' });
      return;
    }

    const newTaskId = await TaskService.createTask(title, description || null, assignee_id || null, creator_id);
    res.status(201).json({ id: newTaskId, message: 'Task created successfully' });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const taskId = parseInt(req.params.id as string, 10);
    const { title, description, status, assignee_id } = req.body;
    const { role, userId } = req.user!;

    if (role === 'admin') {
      await TaskService.updateTaskFull(taskId, title, description || null, status as TaskStatus, assignee_id || null);
    } else {
      // Employee can only update status of their own assigned tasks
      const currentAssigneeId = await TaskService.getTaskAssigneeId(taskId);
      if (currentAssigneeId !== userId) {
         res.status(403).json({ message: 'Not authorized to update this task' });
         return;
      }
      
      await TaskService.updateTaskStatus(taskId, status as TaskStatus);
    }

    res.json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const taskId = parseInt(req.params.id as string, 10);
    await TaskService.deleteTask(taskId);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
