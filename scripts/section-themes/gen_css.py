import json
from color import *
from themes import T, BG, CARD, INK_SURF, FG
def o(L,C,H,a=None):
    C=fit(L,C,H)
    s=f'oklch({L:.3f} {C:.3f} {H%360:.0f}'.replace('0.','.',0)
    s=f'oklch({round(L,3):g} {round(C,3):g} {round(H%360):g}'
    return s+(f' / {a:g})' if a is not None else ')')
HOME_L=dict(accent='#8b5cf6',ink='#6d28d9',soft='#c8b3fe',mid='#ac7afe',contrast='#fff',
  a1='rgb(200 179 254 / 0.55)',a2='rgb(139 92 246 / 0.22)',a3='rgb(147 197 253 / 0.38)',a4='rgb(221 214 254 / 0.6)',
  selection='oklch(.88 .06 293)',ring='#8b5cf6',underline='oklch(.49 .22 293 / .45)',gradA='#8b5cf6',gradB='#a78bfa',glow='rgb(76 29 149)',edge='#a07cf7',tint='oklch(.93 .035 292)',tintFg='oklch(.28 .06 292)')
HOME_D=dict(accent='#8b5cf6',ink='#c8b3fe',soft='#c8b3fe',mid='#ac7afe',contrast='#fff',
  a1='rgb(76 29 149 / 0.45)',a2='rgb(139 92 246 / 0.2)',a3='rgb(30 58 138 / 0.42)',a4='rgb(49 46 129 / 0.4)',
  selection='oklch(.40 .11 293)',ring='#a78bfa',underline='oklch(.81 .09 293 / .45)',gradA='#8b5cf6',gradB='#c084fc',glow='rgb(76 29 149)',edge='#7c3aed',tint='oklch(.922 0 0)',tintFg='oklch(.12 0 0)')
def theme(n,t):
    H=t['h']; res={}
    # light
    la,ca=t['la']; li,ci=t['li']; ls,cs=t['ls']
    acc=(la,ca,H)
    wh=ratio((1,0,0),acc); dk=ratio((0.16,0.02,H),acc)
    contrast='#fff' if wh>=dk else o(0.16,0.02,H)
    res['light']=dict(accent=o(la,ca,H),ink=o(li,ci,H),soft=o(ls,cs,H),mid=o(min(la+0.1,0.8),ca*0.75,H),contrast=contrast,
      a1=o(0.86,0.08,H,0.55),a2=o(la,ca,H,0.22),a3=o(0.86,0.07,H+48,0.38),a4=o(0.93,0.04,H,0.6),
      selection=o(0.88,0.06,H),ring=o(la,ca,H),underline=o(li,ci,H,0.45),gradA=o(la,ca,H),gradB=o(min(la+0.06,0.8),ca,H+30),
      glow=o(0.32,0.13,H),edge=o(max(la,0.66),ca,H),tint=o(0.93,0.035,H),tintFg=o(0.28,0.06,H))
    da,dc=t['da']; di,dci=t['di']
    acc=(da,dc,H)
    wh=ratio((1,0,0),acc); dk=ratio((0.16,0.02,H),acc)
    contrast='#fff' if wh>=dk else o(0.16,0.02,H)
    res['dark']=dict(accent=o(da,dc,H),ink=o(di,dci,H),soft=o(ls,cs,H),mid=o(da-0.08,dc*0.8,H),contrast=contrast,
      a1=o(0.36,0.12,H,0.45),a2=o(da,dc,H,0.2),a3=o(0.34,0.10,H+45,0.42),a4=o(0.30,0.09,H-12,0.4),
      selection=o(0.40,0.09,H),ring=o(da,dc,H),underline=o(di,dci,H,0.45),gradA=o(da,dc,H),gradB=o(da-0.04,dc,H+30),
      glow=o(0.32,0.13,H),edge=o(min(la,0.6),ca,H),tint='oklch(.922 0 0)',tintFg='oklch(.12 0 0)')
    return res
ALL={'home':{'light':HOME_L,'dark':HOME_D}}
for n,t in T.items(): ALL[n]=theme(n,t)
KEYS=['accent','ink','soft','mid','contrast','a1','a2','a3','a4','selection','ring','underline','gradA','gradB','glow','edge','tint','tintFg']
CSSNAME={'gradA':'grad-a','gradB':'grad-b','tintFg':'tint-fg'}
def nm(k): return '--sec-'+CSSNAME.get(k,k)
def block(sel,vals):
    return sel+' {\n'+''.join(f'  {nm(k)}: {vals[k]};\n' for k in KEYS)+'}\n'
out=[]
out.append('''/* ==========================================================================
   Section themes ("smart" theming, like the dashboard's themes).

   Every main section of the site gets its own accent palette on top of the one
   design system. <html data-theme-section="..."> is set before the first paint
   from the route (see src/lib/section-theme.ts) and updated on navigation; the
   tokens below are registered with @property so a change morphs smoothly
   (~600 ms) instead of snapping. Light and dark values are separate, both
   checked for WCAG AA on the page and card backgrounds.

   Tokens (all colours):
     --sec-accent     brand fills, dots, rules, icons (>= 3:1 on the page)
     --sec-ink        accent TEXT on the page / cards / tints (>= 4.5:1)
     --sec-soft       accent text on the dark ink surfaces (>= 4.5:1)
     --sec-mid        in-between tone
     --sec-contrast   text placed on a --sec-accent fill (>= 4.5:1)
     --sec-a1..a4     aurora / glow blobs
     --sec-selection  ::selection background (text keeps --foreground)
     --sec-ring       keyboard focus ring (>= 3:1)
     --sec-underline  link underline
     --sec-grad-a/b   gradient stops (progress bar, hairlines)
     --sec-glow       shadow tint of glass surfaces
     --sec-edge       accent on the transition panel (the destination's colour)
     --sec-tint(-fg)  soft button / chip surface and its text (feeds --primary)
   Brand marks (logo star, intro, LevelStudio icon) use --lu-violet and never
   change. Generated from the OKLCH palette table in docs/section-themes.md.
   ========================================================================== */
''')
for k in KEYS:
    out.append(f"@property {nm(k)} {{\n  syntax: '<color>';\n  inherits: true;\n  initial-value: {HOME_L[k]};\n}}\n")
out.append('\nhtml {\n  transition:\n'+',\n'.join(f'    {nm(k)} 600ms cubic-bezier(0.4, 0, 0.2, 1)' for k in KEYS)+';\n}\n')
out.append('@media (prefers-reduced-motion: reduce) {\n  html {\n    transition: none;\n  }\n}\n')
out.append('\n/* Home = LevelUp violet (also the default when no section is set). */\n')
out.append(block(':root,\n[data-theme-section=\'home\']',HOME_L))
out.append(block('.dark,\n.dark [data-theme-section=\'home\'],\n.dark[data-theme-section=\'home\']',HOME_D))
for n in T:
    out.append(f'\n/* {n} */\n')
    out.append(block(f"[data-theme-section='{n}']",ALL[n]['light']))
    out.append(block(f".dark[data-theme-section='{n}'],\n.dark [data-theme-section='{n}']",ALL[n]['dark']))
open('section-themes.css','w').write(''.join(out))
json.dump(ALL,open('all.json','w'),indent=1)
print(len(''.join(out)))
