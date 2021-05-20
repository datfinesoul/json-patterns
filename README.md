```bash
<sample.csv sed -e "s/^.\{49\}//g" -e 's/\"$/^C' -e 's/""/"/g' -e '1d' > sample.json
<output.json jq -Sc . | sort | uniq | jq . > sorted.json
```
