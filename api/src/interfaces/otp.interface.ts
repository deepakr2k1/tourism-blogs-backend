import { Date } from 'mongoose';

interface userInterface {
    email: string,
    code: string,
    createdAt: Date,
    updatedAt: Date,
}

export default userInterface;