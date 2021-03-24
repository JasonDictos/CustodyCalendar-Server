# [Custody Calendar Server]

This project is the back end code that runs to support the custody calendar system. It is comprised of two api endpoints:

Portal

This is the endpoint servicing as a gateway to a calendar back end. User credentials, or oauth info, billing, and sharing of calendars is all handled by this endpoint.

Calendar

This endpoint gets provisioned when a user signs up through the portal. Each user owns one calendar, but they may be sharing it with others, or they may be guests of other calendars shared to them. The calendar provision gets associated with the user id from the portal. It is here that we store historical events, periodic visitations, entities (dependents, custodians, etc).

Building:
`
npm install
npm run build

`

Starting the docker postgresql instance:
`
cd docker
docker-compose -f postgresql.yml up -d

`

Provisioning the portal and calendar schemas for testing:
`
npm run portal:migrate:latest
npm run calendar:migrate:latest

`

Running the tests
`
npm test
`
