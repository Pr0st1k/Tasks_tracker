export default defineEventHandler(async (event) => {
    localStorage.removeItem('token')
    return { success: true };
});