
import mongoose from "mongoose";import express from 'express';
import config from "config";
import useCconnect from './util/use-connect';
import routes from './routers';
import cors from "cors";
import logger from './util/logger';
import session from 'express-session';
  import connectMongo from 'connect-mongo';
  import cookieParser from 'cookie-parser';
  const app = express();
  const port = config.get<number>("port");
 const MongoStore = connectMongo(session);
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

app.use(
  session({
    secret: 'dfgngksnkgndfs',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);
    routes(app);

app.listen(port, async () => {
logger.info(`App is running at http://localhost:${port}`);

  await useCconnect();
});