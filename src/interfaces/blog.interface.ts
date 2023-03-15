import { Date } from 'mongoose';
import userInterface from './user.interface';

export interface blogInterface {
    title: string,
    snippet: string,
    content: string,
    author: userInterface,
    createdAt: Date,
    updatedAt: Date,
}

export default blogInterface;