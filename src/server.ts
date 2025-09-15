import "dotenv/config";
import path from "path";

import * as moduleAlias from "module-alias";
if (process.env.NODE_ENV !== "development") {
  moduleAlias.addAlias("@", path.resolve(__dirname));
}

import app from "./app";

const PORT: string | number = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
