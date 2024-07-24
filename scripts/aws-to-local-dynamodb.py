# This script is used to copy data from an AWS set of dynamodb tables to a local set of dynamodb tables.

import boto3
import re
import os
from botocore.exceptions import ClientError

# AWS configuration
AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
AWS_SESSION_TOKEN = os.environ.get('AWS_SESSION_TOKEN')
AWS_REGION = os.environ.get('AWS_REGION')
ENV_NAME = os.environ.get('ENV_NAME') # Used to identify AWS tables for a given environment, using table suffix

# Local config
LOCAL_AWS_ACCESS_KEY_ID = 'fake'
LOCAL_AWS_SECRET_ACCESS_KEY = 'fake'
LOCAL_ENDPOINT_URL = 'http://localhost:62224' # Local DynamodDB endpoint
LOCAL_REGION = 'us-fake-1'


def create_aws_session():
    return boto3.Session(
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        aws_session_token=AWS_SESSION_TOKEN,
        region_name=AWS_REGION
    )


def create_local_client():
    return boto3.client('dynamodb', 
                        aws_access_key_id=LOCAL_AWS_ACCESS_KEY_ID,
                        aws_secret_access_key=LOCAL_AWS_SECRET_ACCESS_KEY,
                        endpoint_url=LOCAL_ENDPOINT_URL,
                        region_name=LOCAL_REGION,
                        )


def create_local_table_resource(table_name):
    dynamodb = boto3.resource('dynamodb', 
                              endpoint_url=LOCAL_ENDPOINT_URL,
                              region_name=LOCAL_REGION,
                              aws_access_key_id='fake',
                              aws_secret_access_key='fake')
    return dynamodb.Table(table_name)


def get_aws_tables(aws_client):
    """Retrieve all table names from AWS DynamoDB"""
    tables = []
    paginator = aws_client.get_paginator('list_tables')
    for page in paginator.paginate():
        tables.extend(page['TableNames'])
    return tables


def get_local_tables(local_client):
    """Retrieve all table names from local DynamoDB"""
    tables = []
    paginator = local_client.get_paginator('list_tables')
    for page in paginator.paginate():
        tables.extend(page['TableNames'])
    return tables


def find_matching_aws_table(local_table, aws_tables):
    """Find the matching AWS table for a given local table"""
    base_name = local_table[:-5] if local_table.endswith('Table') else local_table
    pattern = f"{base_name}-[a-z0-9]+-{ENV_NAME}$"
    return next((t for t in aws_tables if re.match(pattern, t)), None)


def get_table_key_schema(client, table_name):
    """Get the key schema for a given table"""
    try:
        response = client.describe_table(TableName=table_name)
        return response['Table']['KeySchema']
    except ClientError as e:
        print(f"Error getting key schema for table {table_name}: {e}")
        return None


def scan_table(table):
    """Scan the entire table and yield items in batches."""
    scan_kwargs = {
        'ConsistentRead': False
    }
    done = False
    start_key = None
    while not done:
        if start_key:
            scan_kwargs['ExclusiveStartKey'] = start_key
        try:
            response = table.scan(**scan_kwargs)
            yield response.get('Items', [])
            start_key = response.get('LastEvaluatedKey', None)
            done = start_key is None
        except ClientError as e:
            print(f"Error scanning table: {e}")
            done = True


def batch_write(local_table, items):
    """Write items to the destination table in batches."""
    with local_table.batch_writer() as batch:
        for item in items:
            try:
                batch.put_item(Item=item)
            except ClientError as e:
                print(f"Error writing item: {e}")
                print(f"Problematic item: {item}")


def copy_table_data(aws_table, local_table, aws_session, local_client):
    """Copy data from AWS table to local table"""
    aws_dynamodb = aws_session.resource('dynamodb')
    aws_client = aws_session.client('dynamodb')
    
    local_table_resource = create_local_table_resource(local_table)
    source_table = aws_dynamodb.Table(aws_table)
    
    # Get key schema for both tables
    aws_key_schema = get_table_key_schema(aws_client, aws_table)
    local_key_schema = get_table_key_schema(local_client, local_table)
    
    if aws_key_schema != local_key_schema:
        print(f"Warning: Key schemas don't match for {aws_table} and {local_table}")
        print(f"AWS schema: {aws_key_schema}")
        print(f"Local schema: {local_key_schema}")
        print("Proceeding with copy anyway.")
    
    total_items = 0
    for batch in scan_table(source_table):
        batch_write(local_table_resource, batch)
        total_items += len(batch)
        print(f"Processed {total_items} items so far...")
    
    print(f"Finished processing {total_items} items from {aws_table} to {local_table}.")


def compare_and_copy_tables():
    if not all([AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SESSION_TOKEN, AWS_REGION, ENV_NAME]):
        print("Error: AWS credentials and config are not set in environment variables.")
        print("Please set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SESSION_TOKEN, AWS_REGION, ENV_NAME.")
        return

    aws_session = create_aws_session()
    aws_client = aws_session.client('dynamodb')
    local_client = create_local_client()

    aws_tables = get_aws_tables(aws_client)
    local_tables = get_local_tables(local_client)

    print(f"Found {len(local_tables)} local tables and {len(aws_tables)} AWS tables.")
    print(f"Local tables: {local_tables}")

    for local_table in local_tables:
        aws_table = find_matching_aws_table(local_table, aws_tables)

        if aws_table:
            print(f"\nFound matching tables:")
            print(f"  Local: {local_table}")
            print(f"  AWS:   {aws_table}")
            print(f"Copying data from {aws_table} to {local_table}")
            copy_table_data(aws_table, local_table, aws_session, local_client)
        else:
            print(f"\nNo matching AWS table found for {local_table}. Skipping.")

    print("\nData copy process completed.")


if __name__ == "__main__":
    print("Starting table comparison and copy process...")
    compare_and_copy_tables()
