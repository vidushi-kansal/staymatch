const weights = require("./weights.json");

function calculateScore(user,person){

let diff =
Math.abs(user.sleep-person.sleep)*weights.sleep +
Math.abs(user.clean-person.clean)*weights.clean +
Math.abs(user.noise-person.noise)*weights.noise +
Math.abs(user.study-person.study)*weights.study +
Math.abs(user.social-person.social)*weights.social;

if(user.smoking !== person.smoking){
diff += weights.smoking;
}

let score = Math.max(0,100-diff*3);

return score;

}

module.exports = calculateScore;