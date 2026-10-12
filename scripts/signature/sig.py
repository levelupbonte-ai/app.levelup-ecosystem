import numpy as np, json, sys
from pen import *
SHEAR=0.22; BASE=140
def sh(p): return (p[0]+(BASE-p[1])*SHEAR, p[1])
# strokes: list of control-point lists (upright design space)
def shift(pts,dx): return [(x+dx,y) for x,y in pts]
LL=[(36,96),(44,62),(62,32),(84,16),(100,16),(106,28),(104,50),(100,84),(98,112),(97,134),(96,144),(92,154),(76,162),(58,156),(54,144),(70,136),(100,138),(122,140)]
REST=[(126,134),(138,116),(148,92),(148,78),(138,72),(128,80),(124,100),(128,124),(142,138),(158,138),(170,126),
 (176,112),(184,94),(192,80),(200,76),(206,92),(214,116),(222,134),(228,138),(236,126),(246,102),(256,84),(266,78),
 (280,78),(288,88),(282,98),(266,102),(254,106),(250,120),(256,134),(272,140),(288,134),(300,122),
 (308,104),(316,76),(324,46),(330,24),(326,12),(316,14),(312,28),(314,54),(318,86),(321,116),(325,134),(335,142),(349,135),(362,124)]
LEVEL=LL+shift(REST,10)
U=[(372,34),(368,24),(376,16),(386,20),(386,40),(382,90),(380,120),(384,138),(396,146),(412,142),(424,126),(434,92),(440,50),(442,22),(441,60),(445,100),(447,130),(452,142),(464,134)]
P=[(470,128),(480,100),(490,80),(494,96),(492,130),(486,170),(480,200),(472,210),(462,204),(466,190),(476,160),(486,130),(490,100),(496,82),(512,76),(528,84),(534,104),(526,126),(510,138),(494,136)]
STROKES={'Level':LEVEL,'U':shift(U,20),'p':shift(P,20)}
FLOURISH=[(70,184),(150,192),(260,190),(360,180),(440,166),(486,150)]
def build():
    res={}
    for name,pts in STROKES.items():
        P=[sh(p) for p in pts]
        c=catmull(P,2.0)
        res[name]=c
    return res
if __name__=='__main__':
    res=build()
    out=[]; cols=['#e11','#18c','#2a2']
    for i,(n,c) in enumerate(res.items()):
        cc,w,l,r=outline(c,1.7,6.4)
        poly=np.vstack([l,r[::-1]])
        out.append('<path d="M'+' L'.join(f'{x:.1f},{y:.1f}' for x,y in poly)+'Z" fill="#111"/>')
        out.append(f'<path d="M'+' L'.join(f'{x:.1f},{y:.1f}' for x,y in c[::3])+f'" fill="none" stroke="{cols[i]}" stroke-width="0.8"/>')
    fl=catmull([sh(p) for p in FLOURISH],2.0); cc,w,l,r=outline(fl,0.8,2.6,taper=(40,60)); poly=np.vstack([l,r[::-1]])
    out.append('<path d="M'+' L'.join(f'{x:.1f},{y:.1f}' for x,y in poly)+'Z" fill="#6d28d9"/>')
    for n,pts in STROKES.items():
        for p in pts:
            x,y=sh(p); out.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="1.6" fill="#f0f"/>')
    open('sig.html','w').write(f'<body style="margin:0;background:#fff"><svg viewBox="0 0 640 230" width="1800" height="646">{"".join(out)}</svg>')
