# json-patterns

```bash
# parse a sumo logic export of just cloudtrail userIdentity objects into a file of
# JSON objects.
<sample.csv sed -e "s/^.\{49\}//g" -e 's/\"$/^C' -e 's/""/"/g' -e '1d' > sample.input


### WiP

node src/index.js -i example/sample.input -i output.json
node src/merge.js
```

