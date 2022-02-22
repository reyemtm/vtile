const fs = require("fs");

describe("vtile", () => {
  const files = fs.readdirSync("./tiles/ohio");
  const tilejson = [];
  const directories = [];
  files.forEach(f => {
    if(!fs.lstatSync("./tiles/ohio/" + f).isDirectory()) tilejson.push("./tiles/ohio/" + f)
  });
  files.forEach(f => {
    if(fs.lstatSync("./tiles/ohio/" + f).isDirectory()) directories.push("./tiles/ohio/" + f)
  })
  const subDir = directories[directories.length -1] + "/" + fs.readdirSync(directories[directories.length -1])[0];
  const vectorTile = fs.readFileSync(subDir + "/" + fs.readdirSync(subDir)[0]);

  test('tilejson should exist and be a parseable JSON Object', () => {
    expect(typeof JSON.parse(fs.readFileSync(tilejson[0]))).toBe("object");
  });

  test('vector tile should exist to be a buffer', () => {
    expect(Buffer.isBuffer(vectorTile)).toBe(true);
  });

});