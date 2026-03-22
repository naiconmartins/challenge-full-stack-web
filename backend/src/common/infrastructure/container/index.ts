import "@/modules/students/infrastructure/container";
import "@/modules/users/infrastructure/container";
import { container } from "tsyringe";
import { JwtAuthProvider } from "../providers/auth-provider/auth-provider.jwt";
import { BcryptjsHashProvider } from "../providers/hash-provider/bcryptjs-hash.provider";

container.registerSingleton("HashProvider", BcryptjsHashProvider);
container.registerSingleton("AuthProvider", JwtAuthProvider);
