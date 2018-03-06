# Train delays

Find train delays

## Installation

```npm i```

### Environment Variables

- REDIS_URL - The URL of your redis DB
- NR_API_KEY - Darwin National Rail API key
- SENDGRID_API_KEY - SendGrid API key to send emails
- TO_EMAIL - Comma seperated list of email addresses to send delays to

## Usage

### Adding journeys

A list of journeys to be checked can be found in [src/config/journeys.json](./src/config/journeys.json).
Update to your required journeys to check against. Use [station codes](http://www.nationalrail.co.uk/stations_destinations/48541.aspx).

### Searching and storing delays

Run ```npm run saveDelays```.
This will query the national rail API for delays and store them against the journey in Redis.
It will only find delays that are over the [DELAY_THRESHOLD](./src/config/app.json), that are 'cancelled' or 'delayed'.
As the national rail API only provides the last 2 hours of data, this needs to be run frequently.
It can be run multiple times and will not duplicate delays as they are stored against their serviceId, so are unique.

### Retrieve all delays

Run ```npm run getDelays```.
This will send an email to the TO_EMAIL with a list of all the stored delays in table format.