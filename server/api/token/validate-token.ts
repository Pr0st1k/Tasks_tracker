import { defineEventHandler } from "h3";
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
    const accessToken = event.headers.get('Authorization')?.split(' ')[1];

    if (!accessToken) {
        return { valid: false };
    }

    try {
        const decoded = jwt.verify(accessToken, 'Steblin-Aleksandr-key-124][[') as { userId: number; role: string };
        return { valid: true, userId: decoded.userId, role: decoded.role };
    } catch (error) {
        return { valide: false }
    }
})