const groq = require('groq-sdk');

const Groq = new groq({
    apikey : process.env.GROQ_API_KEY
});

module.export = Groq;