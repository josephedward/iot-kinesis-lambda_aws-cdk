require("dotenv").config();
console.log(process.env)
const env = process.env;

export const vars = {
  account: {
    sandbox: `${env.ACCOUNT_SANDBOX}`,
    stage: `${env.ACCOUNT_STAGE}`,
    prod: `${env.ACCOUNT_PROD}`,
  },
  region: {
    sandbox: `${env.DEFAULT_REGION}`,
    stage: `${env.DEFAULT_REGION}`,
    prod: `${env.DEFAULT_REGION}`,
  },

  klid: {
    sandbox: `${env.KINESIS_LOGICAL_ID}-test`,
    stage: `${env.KINESIS_LOGICAL_ID}-stage`,
    prod: `${env.KINESIS_LOGICAL_ID}-prod`,
  },
  ilid: {
    sandbox: `${env.IOT_RULE_LOGICAL_ID}-test`,
    stage: `${env.IOT_RULE_LOGICAL_ID}-stage`,
    prod: `${env.IOT_RULE_LOGICAL_ID}-prod`,
  },
  slid: {
    sandbox: `${env.HUB_SERVICE_LAMBDA_LOGICAL_ID}-test`,
    stage: `${env.HUB_SERVICE_LAMBDA_LOGICAL_ID}-stage`,
    prod: `${env.HUB_SERVICE_LAMBDA_LOGICAL_ID}-prod`,
  },
  elid: {
    sandbox: `${env.EVENT_SOURCE_LOGICAL_ID}-test`,
    stage: `${env.EVENT_SOURCE_LOGICAL_ID}-stage`,
    prod: `${env.EVENT_SOURCE_LOGICAL_ID}-prod`,
  },
  rlid: {
    sandbox: `${env.HUB_SERVICE_ROLE_LOGICAL_ID}-test`,
    stage: `${env.HUB_SERVICE_ROLE_LOGICAL_ID}-stage`,
    prod: `${env.HUB_SERVICE_ROLE_LOGICAL_ID}-prod`,
  },
  clid: {
    
    sandbox: `${env.HUB_SERVICE_LOG_GROUP_LOGICAL_ID}-test`,
    stage: `${env.HUB_SERVICE_LOG_GROUP_LOGICAL_ID}-stage`,
    prod: `${env.HUB_SERVICE_LOG_GROUP_LOGICAL_ID}-prod`,
  },
  ecrlid: {
    sandbox: `${env.HUB_SERVICE_ECR_REPO_LOGICAL_ID}-test`,
    stage: `${env.HUB_SERVICE_ECR_REPO_LOGICAL_ID}-stage`,
    prod: `${env.HUB_SERVICE_ECR_REPO_LOGICAL_ID}-prod`,
  },
  kpid: {
    sandbox: `${env.KINESIS_PHYSICAL_ID}_test`,
    stage: `${env.KINESIS_PHYSICAL_ID}`,
    prod: `${env.KINESIS_PHYSICAL_ID}`,
  },
  ipid: {
    sandbox: `${env.IOT_RULE_PHYSICAL_ID}_test`,
    stage: `${env.IOT_RULE_PHYSICAL_ID}`,
    prod: `${env.IOT_RULE_PHYSICAL_ID}`,
  },
  spid: {
    sandbox: `${env.HUB_SERVICE_LAMBDA_PHYSICAL_ID}_test`,
    stage: `${env.HUB_SERVICE_LAMBDA_PHYSICAL_ID}`,
    prod: `${env.HUB_SERVICE_LAMBDA_PHYSICAL_ID}`,
  },
  epid: {
    sandbox: `${env.EVENT_SOURCE_PHYSICAL_ID}_test`,
    stage: `${env.EVENT_SOURCE_PHYSICAL_ID}`,
    prod: `${env.EVENT_SOURCE_PHYSICAL_ID}`,
  },
  rpid: {
    sandbox: `${env.HUB_SERVICE_ROLE_PHYSICAL_ID}_test`,
    stage: `${env.HUB_SERVICE_ROLE_PHYSICAL_ID}`,
    prod: `${env.HUB_SERVICE_ROLE_PHYSICAL_ID}`,
  },
  cpid: {
    sandbox: `${env.HUB_SERVICE_LOG_GROUP_PHYSICAL_ID}_test`,
    stage: `${env.HUB_SERVICE_LOG_GROUP_PHYSICAL_ID}`,
    prod: `${env.HUB_SERVICE_LOG_GROUP_PHYSICAL_ID}`,
  },
  ecrpid: {
    sandbox: `${env.HUB_SERVICE_ECR_REPO_PHYSICAL_ID}_test`,
    stage: `${env.HUB_SERVICE_ECR_REPO_PHYSICAL_ID}`,
    prod: `${env.HUB_SERVICE_ECR_REPO_PHYSICAL_ID}`,
  },
};
