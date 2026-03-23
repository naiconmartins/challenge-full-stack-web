import "reflect-metadata";

import { BcryptjsHashProvider } from "@/common/infrastructure/providers/hash-provider/bcryptjs-hash.provider";
import { dataSource } from "@/common/infrastructure/typeorm";
import { User } from "@/modules/users/infrastructure/typeorm/entities/users.entity";
import { Student } from "@/modules/students/infrastructure/typeorm/entities/student.entity";

type SeedStudent = {
  ra: string;
  name: string;
  email: string;
  cpf: string;
};

const initialStudents: SeedStudent[] = [
  {
    ra: "20250001",
    name: "Ana Clara Souza",
    email: "ana.clara@aluno.edu.br",
    cpf: "416.417.200-26",
  },
  {
    ra: "20250002",
    name: "Bruno Henrique Lima",
    email: "bruno.henrique@aluno.edu.br",
    cpf: "308.307.270-86",
  },
  {
    ra: "20250003",
    name: "Camila Fernandes Rocha",
    email: "camila.fernandes@aluno.edu.br",
    cpf: "275.484.934-22",
  },
  {
    ra: "20250004",
    name: "Diego Martins Oliveira",
    email: "diego.martins@aluno.edu.br",
    cpf: "529.982.247-25",
  },
  {
    ra: "20250005",
    name: "Eduarda Alves Costa",
    email: "eduarda.alves@aluno.edu.br",
    cpf: "714.604.110-25",
  },
];

async function main(): Promise<void> {
  await dataSource.initialize();

  const userRepository = dataSource.getRepository(User);
  const studentRepository = dataSource.getRepository(Student);
  const hashProvider = new BcryptjsHashProvider();

  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@grupoa.local";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "admin123456";
  const adminName = process.env.SEED_ADMIN_NAME ?? "Administrador Inicial";
  const adminRole = "ADMINISTRATIVE" as const;

  const hashedPassword = await hashProvider.generateHash(adminPassword);

  await userRepository.upsert(
    {
      email: adminEmail,
      name: adminName,
      password: hashedPassword,
      role: adminRole,
    },
    ["email"],
  );

  const admin = await userRepository.findOneByOrFail({ email: adminEmail });

  await studentRepository.upsert(
    initialStudents.map(student => ({
      ...student,
      created_by: admin.id,
      updated_by: admin.id,
    })),
    ["ra"],
  );

  console.log(
    `Seed concluido: 1 usuario administrativo (${adminEmail}) e ${initialStudents.length} alunos.`,
  );
}

main()
  .catch(error => {
    console.error("Erro ao executar seed inicial:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });
