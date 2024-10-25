const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Rule = require('./models/Rule');
const {createAST, evaluateAST} = require('./utils/astUtils');
const route = require('./routes/ruleRoutes');

const app = express();

app.use(bodyParser.json());
app.use(cors()); 

mongoose.connect('mongodb://localhost/ruleEngine', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use('/api/rules', route);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
