// This script is used to copy data from an AWS set of DynamoDB tables to a local set of DynamoDB tables.

const { DynamoDBClient, ListTablesCommand, DescribeTableCommand } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand, BatchWriteCommand } = require("@aws-sdk/lib-dynamodb");

// AWS configuration
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_SESSION_TOKEN = process.env.AWS_SESSION_TOKEN;
const AWS_REGION = process.env.AWS_REGION;
const ENV_NAME = process.env.ENV_NAME; // Used to identify AWS tables for a given environment, using table suffix

// Local config
const LOCAL_AWS_ACCESS_KEY_ID = 'fake';
const LOCAL_AWS_SECRET_ACCESS_KEY = 'fake';
const LOCAL_ENDPOINT_URL = 'http://localhost:62224'; // Local DynamoDB endpoint
const LOCAL_REGION = 'us-fake-1';

function createAwsSession() {
    return new DynamoDBClient({
        credentials: {
            accessKeyId: AWS_ACCESS_KEY_ID,
            secretAccessKey: AWS_SECRET_ACCESS_KEY,
            sessionToken: AWS_SESSION_TOKEN,
        },
        region: AWS_REGION,
    });
}

function createLocalClient() {
    return new DynamoDBClient({
        credentials: {
            accessKeyId: LOCAL_AWS_ACCESS_KEY_ID,
            secretAccessKey: LOCAL_AWS_SECRET_ACCESS_KEY,
        },
        endpoint: LOCAL_ENDPOINT_URL,
        region: LOCAL_REGION,
    });
}

async function getAwsTables(awsClient) {
    const tables = [];
    let exclusiveStartTableName = undefined;

    do {
        const command = new ListTablesCommand({ ExclusiveStartTableName: exclusiveStartTableName });
        const response = await awsClient.send(command);
        tables.push(...response.TableNames);
        exclusiveStartTableName = response.LastEvaluatedTableName;
    } while (exclusiveStartTableName);

    return tables;
}

async function getLocalTables(localClient) {
    return getAwsTables(localClient);
}

function findMatchingAwsTable(localTable, awsTables) {
    const baseName = localTable.endsWith('Table') ? localTable.slice(0, -5) : localTable;
    const pattern = new RegExp(`${baseName}-[a-z0-9]+-${ENV_NAME}$`);
    return awsTables.find(t => pattern.test(t));
}

async function getTableKeySchema(client, tableName) {
    try {
        const command = new DescribeTableCommand({ TableName: tableName });
        const response = await client.send(command);
        return response.Table.KeySchema;
    } catch (error) {
        console.error(`Error getting key schema for table ${tableName}:`, error);
        return null;
    }
}

async function* scanTable(client, tableName) {
    const documentClient = DynamoDBDocumentClient.from(client);
    let exclusiveStartKey = undefined;

    do {
        const command = new ScanCommand({
            TableName: tableName,
            ExclusiveStartKey: exclusiveStartKey,
        });

        try {
            const response = await documentClient.send(command);
            yield response.Items;
            exclusiveStartKey = response.LastEvaluatedKey;
        } catch (error) {
            console.error('Error scanning table:', error);
            break;
        }
    } while (exclusiveStartKey);
}

async function batchWrite(client, tableName, items) {
    const documentClient = DynamoDBDocumentClient.from(client);
    const batchSize = 25; // DynamoDB limit

    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        const command = new BatchWriteCommand({
            RequestItems: {
                [tableName]: batch.map(item => ({ PutRequest: { Item: item } })),
            },
        });

        try {
            await documentClient.send(command);
        } catch (error) {
            console.error('Error writing batch:', error);
            console.error('Problematic batch:', batch);
        }
    }
}

async function copyTableData(awsTable, localTable, awsClient, localClient) {
    const awsKeySchema = await getTableKeySchema(awsClient, awsTable);
    const localKeySchema = await getTableKeySchema(localClient, localTable);

    if (JSON.stringify(awsKeySchema) !== JSON.stringify(localKeySchema)) {
        console.warn(`Warning: Key schemas don't match for ${awsTable} and ${localTable}`);
        console.warn(`AWS schema: ${JSON.stringify(awsKeySchema)}`);
        console.warn(`Local schema: ${JSON.stringify(localKeySchema)}`);
        console.warn("Proceeding with copy anyway.");
    }

    let totalItems = 0;
    for await (const batch of scanTable(awsClient, awsTable)) {
        await batchWrite(localClient, localTable, batch);
        totalItems += batch.length;
        console.log(`Processed ${totalItems} items so far...`);
    }

    console.log(`Finished processing ${totalItems} items from ${awsTable} to ${localTable}.`);
}

async function compareAndCopyTables() {
    if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_SESSION_TOKEN || !AWS_REGION || !ENV_NAME) {
        console.error("Error: AWS credentials and config are not set in environment variables.");
        console.error("Please set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SESSION_TOKEN, AWS_REGION, ENV_NAME.");
        return;
    }

    const awsClient = createAwsSession();
    const localClient = createLocalClient();

    const awsTables = await getAwsTables(awsClient);
    const localTables = await getLocalTables(localClient);

    console.log(`Found ${localTables.length} local tables and ${awsTables.length} AWS tables.`);
    console.log(`Local tables: ${localTables}`);

    for (const localTable of localTables) {
        const awsTable = findMatchingAwsTable(localTable, awsTables);

        if (awsTable) {
            console.log("\nFound matching tables:");
            console.log(`  Local: ${localTable}`);
            console.log(`  AWS:   ${awsTable}`);
            console.log(`Copying data from ${awsTable} to ${localTable}`);
            await copyTableData(awsTable, localTable, awsClient, localClient);
        } else {
            console.log(`\nNo matching AWS table found for ${localTable}. Skipping.`);
        }
    }

    console.log("\nData copy process completed.");
}

console.log("Starting table comparison and copy process...");
compareAndCopyTables().catch(console.error);