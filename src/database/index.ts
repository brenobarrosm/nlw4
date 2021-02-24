import { Connection, createConnection, getConnectionOptions } from 'typeorm';

export default async (): Promise<Connection> => {
    const defaultOptions = await getConnectionOptions();

    return createConnection(
        Object.assign(defaultOptions, {

            //Verifica se a var de ambiente é a de test
            database: process.env.NODE_ENV === 'test'
                ? "./src/database/database.test.sqlite" : defaultOptions.database
        })
    );
}