const request = require('supertest');
const app = require('../app');
const Image = require('../models/Image');
require('../models');

let token;
let id;

beforeAll(async () => {
    const res = await request(app).post('/users/login').send({
        email: "testuser@gmail.com",
        password: "testuser",
    });
    token = res.body.token;
});

test('GET /products debe traer todas las productos', async () => {
    const res = await request(app).get('/products');
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
});

test('POST /products debe crear un producto', async () => {
    const product = {
        title: "samsung A-20",
        description: "6 nucleos",
        brand: "samsung",
        price: 1500
    }
    const res = await request(app).post('/products').send(product).set('Authorization', `Bearer ${token}`);
    id = res.body.id;
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(product.title);
    expect(res.body.id).toBeDefined();
});

test('PUT /products/:id debe actualizar un producto', async () => {
    const product = {
        title: "samsung actualizado",
    }
    const res = await request(app).put(`/products/${id}`).send(product).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe(product.title);
});

test('POST /products/:id/images debe insertar imagenes de un producto', async () => {
    const image = await Image.create({
        url: "cualquiercosa.com",
        publicId: "cualquiercosa"
    });
    const res = await request(app).post(`/products/${id}/images`).send([image.id]).set('Authorization', `Bearer ${token}`);
    await image.destroy();
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
});

test('DELETE /products/:id debe eliminar un producto', async () => {
    const res = await request(app).delete(`/products/${id}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
});    

