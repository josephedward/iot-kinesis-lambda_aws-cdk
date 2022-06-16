#!/bin/bash
File=".env"

Lines=$(cat $File)
          for line in $Lines; 
            do
              echo "$line" | tr " " /n
              IFS="="
              lineArr=($line)
              key=${lineArr[0]}
              value=${lineArr[1]}
              echo "$key=$value" 
          done

          # aws ssm get-parameter --name hubserviceenv --with-decryption --query 'Parameter.Value' 
          # > vars.txt
          # #!/bin/bash
          # File="vars.txt"
          # Lines=$(cat $File)
          # for line in $Lines; 
          #   do
          #     echo $line
          #     IFS="="
          #     lineArr=($line)
          #     key=${lineArr[0]}
          #     value=${lineArr[1]}
          #     echo "$key=$value" >> $GITHUB_ENV
          # done
 