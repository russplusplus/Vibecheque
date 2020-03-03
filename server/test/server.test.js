let app = require('../server');
let testServer = require('supertest');

describe('Test the root path', () => {
    test('Unauthenticated GET request to /users should be forbidden', async () => {
        const response = await testServer(app).get('/users');
        expect(response.statusCode).toBe(401)
    })
})