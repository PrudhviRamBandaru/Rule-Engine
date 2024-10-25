const express = require("express");
const Rule = require("../models/Rule");
const { createAST, evaluateAST, combineASTs } = require("../utils/astUtils");

const router = express.Router();

router.post("/", async (req, res) => {
    const { ruleString } = req.body;

    try {
        const ast = createAST(ruleString);
        const newRule = new Rule({ ruleString, ruleAST: ast }); 
        await newRule.save();
        res.status(201).json(newRule);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/", async (_req, res) => {
    try {
        const rules = await Rule.find();
        res.json(rules);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post("/evaluate", async (req, res) => {
    const { ruleId, userData } = req.body;

    try {
        const rule = await Rule.findById(ruleId);

        if (!rule) {
            return res.status(404).json({ error: 'Rule not found' });
        }

        const result = evaluateAST(rule.ruleAST, userData);
        res.json({ result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/combine", async (req, res) => {
    const { ruleIds, logicalOperator } = req.body;

    try {
        const rules = await Rule.find({ _id: { $in: ruleIds } });

        if (!rules || rules.length === 0) {
            return res.status(404).json({ error: 'No rules found' });
        }

        const astList = rules.map(rule => rule.ruleAST);
        const ruleStrings = rules.map(rule => rule.ruleString);

        const combinedAST = combineASTs(astList, logicalOperator);

        const combinedRuleString = ruleStrings.join(` ${logicalOperator === '&' ? 'AND' : 'OR'} `);

        const newCombinedRule = new Rule({ ruleString: combinedRuleString, ruleAST: combinedAST });
        await newCombinedRule.save();

        res.status(201).json(newCombinedRule);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const rule = await Rule.findById(id);

        if (!rule) {
            return res.status(404).json({ error: 'Rule not found' });
        }

        await rule.remove();
        res.status(200).json({ message: 'Rule removed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
