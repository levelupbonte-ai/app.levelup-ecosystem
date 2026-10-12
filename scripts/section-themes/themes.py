from color import *
BG={'light':(0.985,0.002,286),'dark':(0.12,0,0)}
CARD={'light':(1,0,0),'dark':(0.16,0,0)}
INK_SURF=[(0.15,0.008,286),(0.175,0.01,286)]
FG={'light':(0.12,0,0),'dark':(0.985,0,0)}
# name: hue, light(accent L,C ; ink L,C ; soft L,C), dark(accent L,C ; ink L,C)
T={
 'services':dict(h=165, la=(0.60,0.125), li=(0.46,0.10), ls=(0.86,0.095), da=(0.72,0.14), di=(0.86,0.10)),
 'projects':dict(h=248, la=(0.55,0.155),  li=(0.45,0.155),  ls=(0.85,0.09),  da=(0.70,0.15), di=(0.85,0.09)),
 'studio':  dict(h=273, la=(0.52,0.21),  li=(0.44,0.20),  ls=(0.86,0.09),  da=(0.68,0.19), di=(0.85,0.09)),
 'pricing': dict(h=82,  la=(0.64,0.125), li=(0.49,0.10), ls=(0.88,0.10),  da=(0.80,0.13), di=(0.88,0.10)),
 'about':   dict(h=42,  la=(0.62,0.14),  li=(0.49,0.13), ls=(0.87,0.075), da=(0.72,0.14), di=(0.86,0.08)),
 'faq':     dict(h=328, la=(0.52,0.17),  li=(0.45,0.165),  ls=(0.87,0.08),  da=(0.70,0.17), di=(0.86,0.08)),
 'contact': dict(h=8,   la=(0.58,0.19),  li=(0.49,0.185),  ls=(0.88,0.08),  da=(0.72,0.17), di=(0.87,0.08)),
 'legal':   dict(h=265, la=(0.45,0.02),  li=(0.38,0.02),  ls=(0.87,0.012), da=(0.74,0.02), di=(0.88,0.012)),
}
def report():
    rows=[]
    for n,t in T.items():
        h=t['h']
        for mode in ('light','dark'):
            if mode=='light': a=(t['la'][0],t['la'][1],h); ink=(t['li'][0],t['li'][1],h)
            else: a=(t['da'][0],t['da'][1],h); ink=(t['di'][0],t['di'][1],h)
            soft=(t['ls'][0],t['ls'][1],h)
            bg=BG[mode]; card=CARD[mode]
            tint=mix(bg,a,0.10)
            r=dict(n=n,mode=mode,
              ink_bg=ratio(ink,bg), ink_card=ratio(ink,card), ink_tint=ratio(ink,tint),
              acc_bg=ratio(a,bg),
              soft_surf=min(ratio(soft,s) for s in INK_SURF))
            # contrast text on accent: pick best of white / near-black
            wh=ratio((1,0,0),a); bk=ratio((0.16,0.02,h),a)
            r['on_acc']=max(wh,bk); r['on_acc_kind']='white' if wh>=bk else 'dark'
            rows.append(r)
    return rows
if __name__=='__main__':
    for r in report():
        ok = r['ink_bg']>=4.5 and r['ink_card']>=4.5 and r['ink_tint']>=4.5 and r['soft_surf']>=4.5 and r['on_acc']>=4.5
        print(f"{r['n']:9}{r['mode']:6} ink/bg {r['ink_bg']:.2f} card {r['ink_card']:.2f} tint {r['ink_tint']:.2f} | acc/bg {r['acc_bg']:.2f} | soft/surf {r['soft_surf']:.2f} | on-acc {r['on_acc']:.2f} {r['on_acc_kind']} {'OK' if ok else '<<<'}")
