import { BcryptjsHashProvider } from "./bcryptjs-hash.provider";

describe("BcryptjsHashProvider Unit Tests", () => {
  let sut: BcryptjsHashProvider;

  beforeEach(() => {
    sut = new BcryptjsHashProvider();
  });

  it("should return encrypted password", async () => {
    const password = "TestPassword123";
    const hash = await sut.generateHash(password);
    expect(hash).toBeDefined();
  });

  it("should return a hash different from the original password", async () => {
    const password = "TestPassword123";
    const hash = await sut.generateHash(password);
    expect(hash).not.toBe(password);
  });

  it("should return a valid bcrypt hash format", async () => {
    const password = "TestPassword123";
    const hash = await sut.generateHash(password);
    expect(hash).toMatch(/^\$2[ab]\$/);
  });

  it("should generate different hashes for the same password", async () => {
    const password = "TestPassword123";
    const hash1 = await sut.generateHash(password);
    const hash2 = await sut.generateHash(password);
    expect(hash1).not.toBe(hash2);
  });

  it("should return false on compareHash with malformed hash", async () => {
    const result = await sut.compareHash("TestPassword123", "not-a-valid-hash");
    expect(result).toBeFalsy();
  });

  it("should return false on invalid password and hash comparison", async () => {
    const password = "TestPassword123";
    const hash = await sut.generateHash(password);
    const result = await sut.compareHash("fake", hash);
    expect(result).toBeFalsy();
  });

  it("should return true on valid password and hash comparison", async () => {
    const password = "TestPassword123";
    const hash = await sut.generateHash(password);
    const result = await sut.compareHash(password, hash);
    expect(result).toBeTruthy();
  });
});
