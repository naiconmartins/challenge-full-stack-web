import { StudentModel } from "@/modules/students/domain/models/student.model";
import { randomUUID } from "node:crypto";

type Props = Partial<StudentModel>;

const names = [
  "Carlos Eduardo Silva",
  "Ana Paula Souza",
  "João Pedro Oliveira",
  "Mariana Costa Ferreira",
  "Lucas Henrique Santos",
  "Fernanda Lima Alves",
  "Rafael Gonçalves Pereira",
  "Beatriz Rodrigues Martins",
  "Gustavo Araújo Mendes",
  "Juliana Carvalho Nascimento",
];

const validCpfs = [
  "416.417.200-26",
  "308.307.270-86",
  "275.484.934-22",
  "529.982.247-25",
  "714.604.110-25",
  "914.857.780-44",
  "349.196.580-60",
  "453.178.606-13",
  "615.748.746-40",
  "021.749.650-98",
  "631.404.600-29",
  "010.778.500-74",
  "745.515.840-46",
  "502.758.910-57",
  "289.440.030-00",
  "174.049.370-50",
  "503.267.150-38",
  "062.742.480-90",
  "097.627.880-03",
  "018.713.740-90",
];

let nameIndex = 0;
let cpfIndex = 0;
let raCounter = 20230001;

export function StudentsDataBuilder(props: Props): StudentModel {
  const name = props.name ?? names[nameIndex++ % names.length];
  const firstName = name.split(" ")[0].toLowerCase();

  return {
    id: props.id ?? randomUUID(),
    ra: props.ra ?? String(raCounter++),
    name,
    email:
      props.email ?? `${firstName}.${randomUUID().slice(0, 6)}@aluno.edu.br`,
    cpf: props.cpf ?? validCpfs[cpfIndex++ % validCpfs.length],
    created_by: props.created_by ?? null,
    updated_by: props.updated_by ?? null,
    created_at: props.created_at ?? new Date(),
    updated_at: props.updated_at ?? new Date(),
  };
}
