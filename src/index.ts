import dotenv from "dotenv";
import { Log } from "@helpers";
import app from "./server";
import './workers'; // This will initialize all workers

dotenv.config();
const { PORT } = process.env;

const logger = Log.getLogger();

app.listen(PORT, () => {
  logger.info(`The server is running in port localhost ${PORT}`);
}); 