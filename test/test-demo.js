const chai = require('chai');
const chaiJsonSchema = require('chai-json-schema');
const request = require('supertest');

chai.use(chaiJsonSchema);
const expect = chai.expect;

const baseUrl = "https://reqres.in/";

// Skema JSON untuk validasi respons
const userSchema = {
    type: "object",
    required: ["id", "email", "first_name", "last_name", "avatar"],
    properties: {
        id: { type: "integer" },
        email: { type: "string" },
        first_name: { type: "string" },
        last_name: { type: "string" },
        avatar: { type: "string" }
    }
};

describe('API Test for reqres.in', () => {
    // GET Request
    it('Test - GET All Users', async () => {
        const response = await request(baseUrl).get("api/users?page=2");
        expect(response.statusCode).to.equal(200);
        expect(response.body.data).to.be.an('array');
        if (response.body.data.length > 0) {
            expect(response.body.data[0]).to.be.jsonSchema(userSchema);
        }
    });

    // POST Request
    it('Test - POST Create User', async () => {
        const newUser = {
            name: "John Doe",
            job: "Software Engineer"
        };
        const response = await request(baseUrl).post("api/users").send(newUser);
        expect(response.statusCode).to.equal(201);
        expect(response.body).to.include.keys("name", "job", "id", "createdAt");
    });

    // PUT Request
    it('Test - PUT Update User', async () => {
        const updatedUser = {
            name: "Jane Doe",
            job: "Project Manager"
        };
        const response = await request(baseUrl).put("api/users/2").send(updatedUser);
        expect(response.statusCode).to.equal(200);
        expect(response.body).to.include.keys("name", "job", "updatedAt");
    });

    // DELETE Request
    it('Test - DELETE User', async () => {
        const response = await request(baseUrl).delete("api/users/2");
        expect(response.statusCode).to.equal(204);
    });
});
