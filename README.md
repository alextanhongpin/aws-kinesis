# Streaming Events to Kinesis

Sample code written in JavaScript to demonstrate streaming events (publish) from any source to Kinesis. The subscriber can be another client, or StreamSets. 

![StreamSets](/assets/streamsets-kinesis.png)

## Install

Install all required dependencies.

```bash
$ yarn install

# Required for nf
$ yarn global add foreman
```

# Configuration

You need the `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` to run this.
```bash
$ touch .env
```

Your `.env` should contain the following:

```bash
AWS_ACCESS_KEY_ID=<your_aws_access_key_id>
AWS_SECRET_ACCESS_KEY=<your_aws_secret_access_key>
```

# Setup Kinesis

Create a Kinesis Stream and get the `Stream Name`.

At your `IAM`, create a new `User` with the minimum policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "kinesis:*"
            ],
            "Resource": [
                "arn:aws:kinesis:ap-southeast-1:*:stream/<your-stream-name>"
            ]
        }
    ]
}
```

## Run

```bash
$ nf start
```