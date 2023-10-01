import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication system (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  const newUserEmail = Math.floor(Math.random() * 100000) + '@example.com';

  it('signup succeeds with new email', () => {
    return request(app.getHttpServer())
      .post('/users/signup')
      .send({ email: newUserEmail, password: 'password' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(newUserEmail);
      });
  });

  it('signup fails with existing email', async () => {
    await request(app.getHttpServer())
      .post('/users/signup')
      .send({ email: newUserEmail, password: 'password' });

    await request(app.getHttpServer())
      .post('/users/signup')
      .send({ email: newUserEmail, password: 'password' })
      .expect(400);
  });

  it('signup then get current user', async () => {
    const resp = await request(app.getHttpServer())
      .post('/users/signup')
      .send({ email: newUserEmail, password: 'password' })
      .expect(201);

    // get cookie from response to send back for authentication
    const cookie = resp.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/users/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(newUserEmail);
  });
});
