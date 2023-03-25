import { Date } from 'mongoose';

interface userInterface {
    name: string,
    email: string,
    password: string,
    status: string,
    createdAt: Date,
    updatedAt: Date,
}

export default userInterface;