import "reflect-metadata";
import { getApplication, port } from "./app";
import { createConnection } from "typeorm";
import config from "./ormconig";
const server = (): void => {
    createConnection(config)
        .then(async connection => {
            connection.runMigrations();
            console.log(`Please wait for downloading... ⛑️`);

            const application = getApplication();
            application.listen(port, () => {
                console.log(`Server is runnig on port: ${port} ✔️ 🎉`);
            });
        }).catch(error=>{
            console.log(`Hello ...📌... My name is Error, I am here because downloading had gone unsuccessfully... 🚨`, error);
            throw error;
        });
};
server();