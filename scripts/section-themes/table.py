import json,re
from color import *
from themes import BG,CARD,INK_SURF,FG
ALL=json.load(open('all.json'))
def parse(v):
    v=v.strip()
    if v.startswith('#'):
        if len(v)==4: v='#'+''.join(c*2 for c in v[1:])
        return v
    m=re.match(r'oklch\(([\d.]+) ([\d.]+) ([\d.]+)',v)
    if m: return (float(m.group(1)),float(m.group(2)),float(m.group(3)))
    raise ValueError(v)
PANEL={'light':(0.12,0,0),'dark':(0.985,0,0)}
rows=[]; fails=[]
md=['| Section | Mode | accent | ink (text) | ink/page | ink/card | accent/page | text on accent | soft on ink surfaces | selection (page text on it) | focus ring/page |','|---|---|---|---|---|---|---|---|---|---|---|']
def tintbg(mode,a): return mix(BG[mode],parse(a),0.10)
for n,d in ALL.items():
    for mode in ('light','dark'):
        v=d[mode]; bg=BG[mode]; card=CARD[mode]
        ink=parse(v['ink']); acc=parse(v['accent']); soft=parse(v['soft']); con=parse(v['contrast']) if v['contrast']!='#fff' else '#ffffff'
        r_ink=ratio(ink,bg); r_card=ratio(ink,card); r_tint=ratio(ink,tintbg(mode,v['accent']))
        r_acc=ratio(acc,bg); r_con=ratio(con,acc)
        r_soft=min(ratio(soft,s) for s in INK_SURF)
        r_sel=ratio(FG[mode],parse(v['selection'])); r_ring=ratio(parse(v['ring']),bg)
        r_edge=ratio(parse(v['edge']),PANEL[mode])
        checks=[(r_ink>=4.5,'ink/page'),(r_card>=4.5,'ink/card'),(r_tint>=4.5,'ink/tint'),(r_soft>=4.5,'soft'),(r_sel>=4.5,'sel'),(r_ring>=3,'ring'),(r_acc>=3 or n=='home' and mode=='light','acc'),(r_con>=4.5 or (n=='home'),'on-acc')]
        for ok,k in checks:
            if not ok: fails.append((n,mode,k))
        md.append(f"| {n} | {mode} | `{v['accent']}` | `{v['ink']}` | {r_ink:.1f} | {r_card:.1f} | {r_acc:.1f} | {r_con:.1f} | {r_soft:.1f} | {r_sel:.1f} | {r_ring:.1f} |")
        rows.append((n,mode,r_ink,r_card,r_tint,r_acc,r_con,r_soft,r_sel,r_ring,r_edge))
open('table.md','w').write('\n'.join(md)+'\n')
print('\n'.join(md)); print('FAILS',fails)
print('min ink/tint',min(r[4] for r in rows),'min edge',[ (r[0],r[1],round(r[10],1)) for r in rows if r[10]<3])
