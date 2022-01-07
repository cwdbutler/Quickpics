"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const port = 4000;
app.listen(port, () => {
    console.log(`Server running on port ${port}...`);
});
// async function main() {
//   // const post = await prisma.post.create({
//   //   data: {
//   //     caption: "another post",
//   //   },
//   // });
//   const allPosts = await prisma.post.findMany();
//   console.dir(allPosts);
// }
// main().catch((e) => {
//   throw e;
// });
app.get("/", (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allPosts = yield prisma.post.findMany();
    res.send(allPosts);
}));
//# sourceMappingURL=index.js.map