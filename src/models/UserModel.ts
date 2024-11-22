/*
import mongoose, { Schema, Document } from 'mongoose';

// Определяем интерфейс для пользователя
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}

// Создаём схему пользователя
const UserSchema: Schema = new Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ['Admin', 'User', 'Guest'], default: 'User' },
    },
    {
        timestamps: true, // Автоматически добавляет createdAt и updatedAt
    }
);

// Создаём модель пользователя
export default mongoose.model<IUser>('User', UserSchema);
*/
