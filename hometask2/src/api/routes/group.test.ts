import supertest from 'supertest';

describe('Group Controller Methods', () => {
  let token: string;
  let groupId: number;
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

  test('POST responds to /api/group/', async () => {
    const res = await supertest(host)
      .post('/api/group/')
      .set('Content-type', 'application/json')
      .set('Authorization', `Token ${token}`)
      .send({
        name: 'SuperUser',
        permissions: ['READ', 'WRITE', 'SHARE', 'DELETE', 'UPLOAD_FILES'],
      });

    groupId = res.statusCode === 200 ? res.body.data.id : 1;
    expect(res.statusCode).toBe(200);
  });

  test('GET responds to /api/group/id', async () => {
    const res = await supertest(host)
      .get('/api/group/id')
      .set('Content-type', 'application/json')
      .set('Authorization', `Token ${token}`)
      .send({
        id: groupId,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.name).toBe('SuperUser');
  });

  test('PUT responds to /api/group/id', async () => {
    const res = await supertest(host)
      .put('/api/group/id')
      .set('Content-type', 'application/json')
      .set('Authorization', `Token ${token}`)
      .send({
        id: groupId,
        name: 'SuperUser',
        permissions: ['READ', 'WRITE', 'SHARE', 'DELETE'],
      });
    expect(res.statusCode).toBe(200);
  });

  test('GET responds to /api/group/', async () => {
    const res = await supertest(host)
      .get('/api/group/')
      .set('Content-type', 'application/json')
      .set('Authorization', `Token ${token}`);
    expect(res.statusCode).toBe(200);
  });

  test('DELETE responds to /api/group/id', async () => {
    const res = await supertest(host)
      .delete('/api/group/id')
      .set('Content-type', 'application/json')
      .set('Authorization', `Token ${token}`)
      .send({
        id: groupId,
      });
    expect(res.statusCode).toBe(200);
  });

  test('POST responds to /api/group/users', async () => {
    const res = await supertest(host)
      .post('/api/group/users')
      .set('Content-type', 'application/json')
      .set('Authorization', `Token ${token}`)
      .send({
        groupId,
        userIds: [],
      });
    expect(res.statusCode).toBe(200);
  });
});
