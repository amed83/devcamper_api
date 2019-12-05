const NodeGeocoder = require('node-geocoder');

const options = {
    provider : process.env.GEOCODER_PROVIDER,
    httpAdapter: 'https', // Default
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
}


const geocode = NodeGeocoder(options)

module.exports= geocode