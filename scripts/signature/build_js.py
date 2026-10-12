import json,sys
d=json.load(open('sigdata.json'))
def fix(o):
    return o
js=open('template.js').read().replace('__SIG__',json.dumps(d,separators=(',',':')))
out=sys.argv[1]
open(out,'w').write(js)
print(len(js))
