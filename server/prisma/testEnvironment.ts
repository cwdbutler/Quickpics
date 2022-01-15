const NodeEnvironment = require("jest-environment-node");
const randomString = require("randomstring");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const { PrismaClient } = require("@prisma/client");

class PrismaTestEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);

    // generate a schema with a random name
    this.schema = `test_${randomString.generate({
      length: 16,
      charset: "alphanumeric",
      capitalization: "lowercase",
    })}`;
    // ensures each test suite has an empty database

    this.databaseUrl =
      "postgres://postgres:postgres@localhost:5432/quickpics-test";
    process.env.DATABASE_URL = this.databaseUrl;
    this.global.process.env.DATABASE_URL = this.databaseUrl;
    this.client = new PrismaClient();
  }

  async setup() {
    await this.client.$executeRawUnsafe(
      `create schema if not exists "${this.schema}"`
    );

    const url = `${this.databaseUrl}?schema=${this.schema}`;
    process.env.DATABASE_URL = url;
    this.global.process.env.DATABASE_URL = url;
    await exec("yarn prisma:deploy");

    return super.setup();
  }

  async teardown() {
    // drop the schema after the tests have completed
    await this.client.$executeRawUnsafe(
      `drop schema if exists "${this.schema}" cascade`
    );
    await this.client.$disconnect();
  }
}

module.exports = PrismaTestEnvironment;
