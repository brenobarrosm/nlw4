import request from 'supertest';
import { app } from '../app';
import createConnection from '../database';

describe("Users", () => {
    beforeAll(async () => {
        const connection = await createConnection();
        await connection.runMigrations();
    })

    //Testar a inserção de usuário
    it("Should be able to create a new user", async () => {
        //salva na const "response", a request feita
        const response = await request(app)
            .post("/users")
            .send({
                name: "User Example",
                email: "user@example.com"
            });

        expect(response.status).toBe(201);
    });

    //Testar a opção de não existirem 2 ou mais emails iguais
    it("Should not be able to create a user with exist email", async () => {
        const response = await request(app)
            .post("/users")
            .send({
                name: "User Example",
                email: "user@example.com"
            });

        expect(response.status).toBe(400);
    });
});