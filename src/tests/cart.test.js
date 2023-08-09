const request = require('supertest');
const app = require('../app');
const Product = require('../models/Product');
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

test('GET /cart debe traer los productos del carrito', async () => {
    const res = await request(app).get('/cart').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
});

test('POST /cart debe crear un producto en el carrito', async () => {
    const product = await Product.create({
        title: "samsung A-20",
        description: "6 nucleos",
        brand: "samsung",
        price: 1500
    });
    const cart = {
        productId: product.id,
        quantity: 2
    }
    const res = await request(app).post('/cart').send(cart).set('Authorization', `Bearer ${token}`);
    id = res.body.id;
    await product.destroy();
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.quantity).toBe(cart.quantity);
});

test('PUT /cart/:id debe actualizar un producto', async () => {
    const body = {
        quantity: 3
    }
    const res = await request(app).put(`/cart/${id}`).send(body).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.quantity).toBe(body.quantity);
});

test('DELETE /cart/:id debe eliminar un producto', async () => {
    const res = await request(app).delete(`/cart/${id}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
});    

