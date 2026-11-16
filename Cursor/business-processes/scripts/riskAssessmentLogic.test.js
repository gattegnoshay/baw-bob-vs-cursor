/**
 * Lightweight assertion suite for CLIR risk rules (no Jest required).
 * Run: node business-processes/scripts/riskAssessmentLogic.test.js
 */
var assessRisk = require("./riskAssessmentLogic").assessRisk;

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(label + ": expected " + JSON.stringify(expected) + " but got " + JSON.stringify(actual));
  }
}

var cases = [
  {
    name: "Rule 1 AUTO_REJECT on low credit score",
    input: { creditScore: 620, annualIncome: 100000, currentLimit: 5000, requestedIncrease: 8000 },
    expect: { riskLevel: "AUTO_REJECT", autoApproved: false, decisionStatus: "REJECTED" }
  },
  {
    name: "Rule 2 HIGH_RISK on high exposure ratio",
    input: { creditScore: 720, annualIncome: 40000, currentLimit: 25000, requestedIncrease: 30000 },
    expect: { riskLevel: "HIGH_RISK", autoApproved: false, decisionStatus: "PENDING_UNDERWRITER" }
  },
  {
    name: "Rule 3 HIGH_RISK when increase exceeds 30% capacity",
    input: { creditScore: 740, annualIncome: 100000, currentLimit: 10000, requestedIncrease: 50000 },
    expect: { riskLevel: "HIGH_RISK", autoApproved: false, decisionStatus: "PENDING_UNDERWRITER" }
  },
  {
    name: "Default LOW_RISK auto-approve",
    input: { creditScore: 760, annualIncome: 120000, currentLimit: 10000, requestedIncrease: 15000 },
    expect: { riskLevel: "LOW_RISK", autoApproved: true, decisionStatus: "APPROVED" }
  }
];

var passed = 0;
cases.forEach(function (c) {
  var result = assessRisk(c.input);
  assertEqual(result.riskLevel, c.expect.riskLevel, c.name + " riskLevel");
  assertEqual(result.autoApproved, c.expect.autoApproved, c.name + " autoApproved");
  assertEqual(result.decisionStatus, c.expect.decisionStatus, c.name + " decisionStatus");
  passed += 1;
  console.log("PASS " + c.name);
});

console.log("All " + passed + " risk-rule tests passed.");
