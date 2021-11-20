import express, { Express, Response, Request, NextFunction } from 'express';
import dotenv from 'dotenv';
import compression from 'compression';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from "cors";
import { groupRouter, ticketRouter, commentRouter, boardRouter, activityLogRouter } from './routes/index';
import swaggerUI from 'swagger-ui-express';
import * as swaggerDocs from './swagger/openapi.json';

dotenv.config();
export const port = process.env.PORT || 8888;

export const getApplication = (): Express => {
    const app = express()
        .use(express.json())
        .use(cors({ origin: `*`, }))
        .use(helmet())
        .use(morgan("tiny"))
        .use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs))
        .use("/group", groupRouter)
        .use("/ticket", ticketRouter)
        .use("/comment", commentRouter)
        .use("/board", boardRouter)
        .use("/activity_log", activityLogRouter)
        .use(compression())
        .get("/", (req: Request, res: Response) => {
            res.redirect( "https://deployment-team-3.herokuapp.com/api-docs/" );
        })
    return app;
}; 
