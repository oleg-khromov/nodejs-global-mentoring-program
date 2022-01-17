import supertest from 'supertest';

describe('User Controller Methods', () => {
  let token: string;
  let userId: number;
  const user = {
    login: 'Oleg',
    password: 'password',
  };
  const host = 'http://localhost:3000';

  beforeAll(async () => {
    const res = await supertest(host)
      .post('/api/auth/signin')
      .set('Content-type', 'application/json')
      .send({ ...user });
    token = res.body.data.token;
  });

  test('POST responds to /api/users/', async () => {
    const res = await supertest(host)
      .post('/api/users/')
      .set('Content-type', 'application/json')
      .set('Authorization', `Token ${token}`)
      .send({
        login: 'Kostya',
        password: 'qwerty',
        age: '50',
      });

    userId = res.statusCode === 200 ? res.body.data.id : 1;
    expect(res.statusCode).toBe(200);
  });

  test('GET responds to /api/users/id', async () => {
    const res = await supertest(host)
      .get('/api/users/id')
      .set('Content-type', 'application/json')
      .set('Authorization', `Token ${token}`)
      .send({
        id: userId,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.login).toBe('Kostya');
  });

  test('PUT responds to /api/users/id', async () => {
    const res = await supertest(host)
      .put('/api/users/id')
      .set('Content-type', 'application/json')
      .set('Authorization', `Token ${token}`)
      .send({
        id: userId,
        login: 'Kostyantin',
        password: 'qwerty',
        age: '20',
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.age).toBe(20);
  });

  test('GET responds to /api/users/', async () => {
    const res = await supertest(host)
      .get('/api/users/')
      .set('Content-type', 'application/json')
      .set('Authorization', `Token ${token}`)
      .send({
        str: 'Kost',
        limit: 2,
      });
    expect(res.statusCode).toBe(200);
  });

  test('DELETE responds to /api/users/id', async () => {
    const res = await supertest(host)
      .delete('/api/users/id')
      .set('Content-type', 'application/json')
      .set('Authorization', `Token ${token}`)
      .send({
        id: userId,
      });
    expect(res.statusCode).toBe(200);
  });
});
