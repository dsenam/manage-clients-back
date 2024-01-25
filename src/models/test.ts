const { Pool } = require("pg");
import { mocked } from "jest-mock";
import { getClients, createClient } from "./clientModel";

jest.mock("pg", () => {
  const mPool = {
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

describe("clientModel", () => {
  let pool: { query: any; };
  beforeEach(() => {
    pool = new Pool();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should get clients", async () => {
    mocked(pool.query).mockResolvedValueOnce({ rows: [], rowCount: 0 });
    const data = await getClients();
    expect(data).toEqual({ rows: [], rowCount: 0 });
    expect(pool.query).toHaveBeenCalledWith("SELECT * FROM clients", []);
  });

  it("should create a client", async () => {
    const newClient = {
      name: "Test Client",
      email: "test@client.com",
      phone: "123456789",
      coordinate_x: "10",
      coordinate_y: "20",
    };
    mocked(pool.query).mockResolvedValueOnce({
      rows: [newClient],
      rowCount: 1,
    });
    const data = await createClient(
      newClient.name,
      newClient.email,
      newClient.phone,
      newClient.coordinate_x,
      newClient.coordinate_y
    );
    expect(data).toEqual({ rows: [newClient], rowCount: 1 });
    expect(pool.query).toHaveBeenCalledWith(
      "INSERT INTO clients (name, email, phone, coordinate_x, coordinate_y) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [
        newClient.name,
        newClient.email,
        newClient.phone,
        newClient.coordinate_x,
        newClient.coordinate_y,
      ]
    );
  });

  it('should filter clients by name', async () => {
    mocked(pool.query).mockResolvedValueOnce({ rows: [], rowCount: 0 });
    const data = await getClients('Test Client');
    expect(data).toEqual({ rows: [], rowCount: 0 });
    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM clients WHERE name = $1', ['Test Client']);
  });

  it('should filter clients by email', async () => {
    mocked(pool.query).mockResolvedValueOnce({ rows: [], rowCount: 0 });
    const data = await getClients(undefined, 'test@client.com');
    expect(data).toEqual({ rows: [], rowCount: 0 });
    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM clients WHERE email = $1', ['test@client.com']);
  });

  it('should filter clients by phone', async () => {
    mocked(pool.query).mockResolvedValueOnce({ rows: [], rowCount: 0 });
    const data = await getClients(undefined, undefined, '123456789');
    expect(data).toEqual({ rows: [], rowCount: 0 });
    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM clients WHERE phone = $1', ['123456789']);
  });
});
