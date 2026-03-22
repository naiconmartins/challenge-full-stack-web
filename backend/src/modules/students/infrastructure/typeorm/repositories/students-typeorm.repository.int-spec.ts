import { ConflictError } from "@/common/domain/errors/conflict-error";
import { NotFoundError } from "@/common/domain/errors/not-found-error";
import { StudentModel } from "@/modules/students/domain/models/student.model";
import { randomUUID } from "node:crypto";
import { DataSource } from "typeorm";
import { Student } from "../entities/student.entity";
import { StudentsTypeormRepository } from "./students-typeorm.repository";

declare const testDataSource: DataSource;
declare function StudentsDataBuilder(
  props: Partial<StudentModel>,
): StudentModel;

describe("StudentsTypeormRepository integration tests", () => {
  let ormRepository: StudentsTypeormRepository;
  let typeormEntityManager: any;

  beforeAll(async () => {
    await testDataSource.initialize();
    typeormEntityManager = testDataSource.createEntityManager();
  });

  afterAll(async () => {
    await testDataSource.manager.query("DELETE FROM students");
    await testDataSource.destroy();
  });

  beforeEach(async () => {
    await testDataSource.manager.query("DELETE FROM students");
    ormRepository = new StudentsTypeormRepository(
      typeormEntityManager.getRepository(Student),
    );
  });

  describe("findById", () => {
    it("should throw NotFoundError when student does not exist", async () => {
      const id = randomUUID();
      await expect(ormRepository.findById(id)).rejects.toThrow(
        new NotFoundError(`Student not found using ID ${id}`),
      );
    });

    it("should find a student by id", async () => {
      const data = StudentsDataBuilder({});
      const student = testDataSource.manager.create(Student, data);
      await testDataSource.manager.save(student);

      const result = await ormRepository.findById(student.id);
      expect(result.id).toEqual(student.id);
      expect(result.name).toEqual(student.name);
      expect(result.email).toEqual(student.email);
      expect(result.ra).toEqual(student.ra);
      expect(result.cpf).toEqual(student.cpf);
    });
  });

  describe("create", () => {
    it("should create a new student object", () => {
      const data = StudentsDataBuilder({});
      const result = ormRepository.create(data);
      expect(result.name).toEqual(data.name);
      expect(result.email).toEqual(data.email);
      expect(result.ra).toEqual(data.ra);
      expect(result.cpf).toEqual(data.cpf);
    });
  });

  describe("insert", () => {
    it("should insert a new student", async () => {
      const data = StudentsDataBuilder({});
      const result = await ormRepository.insert(data);
      expect(result.id).toBeDefined();
      expect(result.name).toEqual(data.name);
      expect(result.email).toEqual(data.email);
      expect(result.ra).toEqual(data.ra);
      expect(result.cpf).toEqual(data.cpf);
    });
  });

  describe("update", () => {
    it("should throw NotFoundError when student does not exist", async () => {
      const data = StudentsDataBuilder({});
      await expect(ormRepository.update(data)).rejects.toThrow(
        new NotFoundError(`Student not found using ID ${data.id}`),
      );
    });

    it("should update a student", async () => {
      const data = StudentsDataBuilder({});
      const student = testDataSource.manager.create(Student, data);
      await testDataSource.manager.save(student);
      student.name = "Updated Name";

      const result = await ormRepository.update(student);
      expect(result.name).toEqual("Updated Name");
    });
  });

  describe("delete", () => {
    it("should throw NotFoundError when student does not exist", async () => {
      const id = randomUUID();
      await expect(ormRepository.delete(id)).rejects.toThrow(
        new NotFoundError(`Student not found using ID ${id}`),
      );
    });

    it("should delete a student", async () => {
      const data = StudentsDataBuilder({});
      const student = testDataSource.manager.create(Student, data);
      await testDataSource.manager.save(student);

      await ormRepository.delete(student.id);

      const result = await testDataSource.manager.findOneBy(Student, {
        id: student.id,
      });
      expect(result).toBeNull();
    });
  });

  describe("conflictingCpf", () => {
    it("should not throw when CPF does not exist", async () => {
      await expect(
        ormRepository.conflictingCpf("00000000000"),
      ).resolves.not.toThrow();
    });

    it("should throw ConflictError when CPF already exists", async () => {
      const data = StudentsDataBuilder({ cpf: "12345678901" });
      const student = testDataSource.manager.create(Student, data);
      await testDataSource.manager.save(student);

      await expect(ormRepository.conflictingCpf("12345678901")).rejects.toThrow(
        new ConflictError("A student with this CPF already exists"),
      );
    });
  });

  describe("conflictingRa", () => {
    it("should not throw when RA does not exist", async () => {
      await expect(
        ormRepository.conflictingRa("9999999"),
      ).resolves.not.toThrow();
    });

    it("should throw ConflictError when RA already exists", async () => {
      const data = StudentsDataBuilder({ ra: "1234567" });
      const student = testDataSource.manager.create(Student, data);
      await testDataSource.manager.save(student);

      await expect(ormRepository.conflictingRa("1234567")).rejects.toThrow(
        new ConflictError("A student with this RA already exists"),
      );
    });
  });

  describe("conflictingEmail", () => {
    it("should not throw when email does not exist", async () => {
      await expect(
        ormRepository.conflictingEmail("unique@test.com"),
      ).resolves.not.toThrow();
    });

    it("should throw ConflictError when email already exists", async () => {
      const data = StudentsDataBuilder({ email: "conflict@test.com" });
      const student = testDataSource.manager.create(Student, data);
      await testDataSource.manager.save(student);

      await expect(
        ormRepository.conflictingEmail("conflict@test.com"),
      ).rejects.toThrow(
        new ConflictError("A student with this email already exists"),
      );
    });

    it("should not throw when email belongs to the excluded student", async () => {
      const data = StudentsDataBuilder({ email: "conflict@test.com" });
      const student = testDataSource.manager.create(Student, data);
      await testDataSource.manager.save(student);

      await expect(
        ormRepository.conflictingEmail("conflict@test.com", student.id),
      ).resolves.not.toThrow();
    });
  });

  describe("search", () => {
    it("should apply only pagination when other params are null", async () => {
      const arrange = Array.from({ length: 16 }, () => StudentsDataBuilder({}));
      const data = testDataSource.manager.create(Student, arrange);
      await testDataSource.manager.save(data);

      const result = await ormRepository.search({
        page: 1,
        per_page: 15,
        sort: null,
        sort_dir: null,
        filter: null,
      });

      expect(result.total).toEqual(16);
      expect(result.items.length).toEqual(15);
    });

    it("should order by created_at DESC by default", async () => {
      const created_at = new Date();
      const models: StudentModel[] = Array.from({ length: 16 }, (_, index) => ({
        ...StudentsDataBuilder({}),
        name: `Student ${index}`,
        created_at: new Date(created_at.getTime() + index),
      }));
      const data = testDataSource.manager.create(Student, models);
      await testDataSource.manager.save(data);

      const result = await ormRepository.search({
        page: 1,
        per_page: 15,
        sort: null,
        sort_dir: null,
        filter: null,
      });

      expect(result.items[0].name).toEqual("Student 15");
      expect(result.items[14].name).toEqual("Student 1");
    });

    it("should apply paginate and sort", async () => {
      const created_at = new Date();
      const models: StudentModel[] = "badec".split("").map((letter, index) => ({
        ...StudentsDataBuilder({}),
        name: letter,
        created_at: new Date(created_at.getTime() + index),
      }));
      const data = testDataSource.manager.create(Student, models);
      await testDataSource.manager.save(data);

      let result = await ormRepository.search({
        page: 1,
        per_page: 2,
        sort: "name",
        sort_dir: "ASC",
        filter: null,
      });

      expect(result.items[0].name).toEqual("a");
      expect(result.items[1].name).toEqual("b");
      expect(result.items.length).toEqual(2);

      result = await ormRepository.search({
        page: 1,
        per_page: 2,
        sort: "name",
        sort_dir: "DESC",
        filter: null,
      });

      expect(result.items[0].name).toEqual("e");
      expect(result.items[1].name).toEqual("d");
      expect(result.items.length).toEqual(2);
    });

    it("should search using filter, sort and paginate", async () => {
      const created_at = new Date();
      const names = ["test", "a", "TEST", "b", "TeSt"];
      const models: StudentModel[] = names.map((name, index) => ({
        ...StudentsDataBuilder({}),
        name,
        created_at: new Date(created_at.getTime() + index),
      }));
      const data = testDataSource.manager.create(Student, models);
      await testDataSource.manager.save(data);

      let result = await ormRepository.search({
        page: 1,
        per_page: 2,
        sort: "name",
        sort_dir: "ASC",
        filter: "TEST",
      });

      expect(result.items[0].name).toEqual("test");
      expect(result.items[1].name).toEqual("TeSt");
      expect(result.items.length).toEqual(2);
      expect(result.total).toEqual(3);

      result = await ormRepository.search({
        page: 2,
        per_page: 2,
        sort: "name",
        sort_dir: "ASC",
        filter: "TEST",
      });

      expect(result.items[0].name).toEqual("TEST");
      expect(result.items.length).toEqual(1);
      expect(result.total).toEqual(3);
    });
  });
});
