// rename dist/index.html into index.lp, so that LogicMachine will use authentication check on the app
import fs from "fs";

fs.renameSync("./dist/index.html", "./dist/index.lp");
