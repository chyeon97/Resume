import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { sequelize } from './connections/dbConnection.js';
import { s3 } from './connections/s3Connection.js';
import { config } from './config.js';
import accountsRouter from './router/accountsRouter.js';
import usersRouter from './router/usersRouter.js';
import resumesRouter from './router/resumesRouter.js';
import tempsRouter from './router/tempsRouter.js';

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan('tiny'));

// 회원가입, 로그인
app.use('/accounts', accountsRouter);

// 회원 정보 수정, 탈퇴
app.use('/users', usersRouter);

// 이력서 관리
app.use('/resumes', resumesRouter);

// 임시 저장, 불러오기
app.use('/temps', tempsRouter);

sequelize.sync().then(() => {
  s3.sync().then(() => {
    app.listen(config.host.port);
  });
});
