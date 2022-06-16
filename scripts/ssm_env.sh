 aws ssm put-parameter --name hubserviceenv --value "$(cat .env)" --type SecureString
#   aws ssm get-parameter --name hubserviceenv --with-decryption --query 'Parameter.Value'