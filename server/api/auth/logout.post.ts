export default defineEventHandler(async (event) => {
    localStorage.removeItem('accessToken')
    return { success: true };
});