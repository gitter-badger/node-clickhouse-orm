import { ClickhouseOrm } from "../lib";
import * as Log from "../lib/log";
import { initConfig, initSchema } from "../mock/index";

jest.mock("../lib/log");

describe("Orm can work normal", () => {
  let orm;
  beforeEach(() => {
    orm = ClickhouseOrm(initConfig);
  });

  test("generated orm should have two property that are createDatabase and model", () => {
    expect(orm).toHaveProperty("createDatabase");
    expect(orm).toHaveProperty("model");
  });

  test("create database success", async () => {
    await orm.createDatabase();

    expect(Log.Log).toHaveBeenCalledTimes(1);
  });

  test("create model success", async () => {
    await orm.model(initSchema);

    expect(Log.DebugLog).toHaveBeenCalledTimes(1);
  });
});

describe("Orm configure the cluster", () => {
  let orm;
  const cluster = "default_cluster";
  beforeEach(() => {
    orm = ClickhouseOrm({ ...initConfig, db: { ...initConfig.db, cluster } });
  });

  test("getCreateDatabaseSql stringContaining ON CLUSTER", () => {
    expect(orm.getCreateDatabaseSql()).toEqual(
      expect.stringContaining(`ON CLUSTER ${cluster}`)
    );
  });

  test("orm instance db.cluster", () => {
    expect(orm.db.cluster).toEqual(cluster);
  });
});
