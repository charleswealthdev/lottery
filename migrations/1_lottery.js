var lottery=artifacts.require("./lottery.sol");
module.exports = function (deployer) {
    deployer.deploy(lottery);
}