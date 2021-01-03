import * as mongoose from "mongoose";
import { dbConfig } from "../dbConfig";

describe("Mongo Connection", () => {
    test("Client connection with localhost", async() => {
        let testClient;

        try {
            // Set connection
            testClient = await mongoose.connect(dbConfig.local, 
                {
                    useNewUrlParser: true,  
                    useUnifiedTopology: true 
                });
            // Obtain valid response from db
            expect(testClient).not.toBe(null);
            // Get hostname and port from current valid connection
            const clientHost = testClient.connections[0].host;
            const clientPort = testClient.connections[0].port;
            const collectionName = testClient.connections[0].name;
            // Test local connection custom values
            expect(clientHost).toBe("localhost");
            expect(clientPort).toBe(27017);
            expect(collectionName).toBe("pelis");
        } catch (error) {
            console.log(typeof error);
        } finally {
            mongoose.disconnect();
        }
    })

    test("Client connection with MongoURI", async() => {
        let testClient;

        try {
            // Set connection
            testClient = await mongoose.connect(dbConfig.mongoURI, 
                {
                    useNewUrlParser: true,  
                    useUnifiedTopology: true 
                });
            // Obtain valid response from db
            expect(testClient).not.toBe(null);

            // Get hostname and port from current valid connection
            const clientHost = testClient.connections[0].host;
            const clientPort = testClient.connections[0].port;
            const collectionName = testClient.connections[0].name;
            // Test URI connection custom values
            expect(clientHost).toBe('cluster0-shard-00-00.eb80o.mongodb.net');
            expect(clientPort).toBe(27017);
            expect(collectionName).toBe('sample_mflix');
        } catch (error) {
            console.log(typeof error);
        } finally {
            mongoose.disconnect();
        }
    })

});