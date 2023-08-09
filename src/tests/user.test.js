const request = require('supertest');
const app = require('../app');

let id;
let token;

test('POST /users debe crear un usuario', async () => {
    const user = {
        firstName: "Brian",
        lastName: "Rodriguez",
        password: "12345",
        email: "brian3@gmail.com",
        phone: "3111"
    }
    const res = await request(app).post('/users').send(user);
    id = res.body.id;
    expect(res.status).toBe(201);
    expect(res.body.firstName).toBe(user.firstName);
    expect(res.body.id).toBeDefined();
    expect(res.body.password).not.toBe(user.password);
});

test('POST /users/login', async () => {
    const body = {
        email: "brian3@gmail.com",
        password: "12345"
    }
    const res = await request(app).post('/users/login').send(body);
    token = res.body.token;
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
});

test('POST /users/login credenciales incorrectas', async () => {
    const body = {
        email: "incorrecto@gmail.com",
        password: "incorrecto12345"
    }
    const res = await request(app).post('/users/login').send(body);
    expect(res.status).toBe(401);
});

test('GET /users debe traer todos las usuarios', async () => {
    const res = await request(app).get('/users').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
});

test('PUT /users/:id debe actualizar un usuario', async () => {
    const userUp = {
        firstName: "Brian actualizado",
    }
    const res = await request(app).put(`/users/${id}`).send(userUp).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.firstName).toBe(userUp.firstName);
});

test('DELETE /users/:id debe eliminar un usuario', async () => {
    const res = await request(app).delete(`/users/${id}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
});    

