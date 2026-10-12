import math, re
def oklch_to_lin(L,C,H):
    h=math.radians(H); a=C*math.cos(h); b=C*math.sin(h)
    l_=L+0.3963377774*a+0.2158037573*b
    m_=L-0.1055613458*a-0.0638541728*b
    s_=L-0.0894841775*a-1.2914855480*b
    l,m,s=l_**3,m_**3,s_**3
    r= 4.0767416621*l-3.3077115913*m+0.2309699292*s
    g=-1.2684380046*l+2.6097574011*m-0.3413193965*s
    bb=-0.0041960863*l-0.7034186147*m+1.7076147010*s
    return r,g,bb
def in_gamut(rgb,eps=1e-4): return all(-eps<=v<=1+eps for v in rgb)
def fit(L,C,H):
    c=C
    while c>0 and not in_gamut(oklch_to_lin(L,c,H)): c-=0.002
    return max(c,0)
def lin_to_srgb(v):
    v=min(1,max(0,v)); return 12.92*v if v<=0.0031308 else 1.055*v**(1/2.4)-0.055
def hexs(L,C,H):
    r=oklch_to_lin(L,fit(L,C,H),H)
    return '#%02x%02x%02x'%tuple(round(lin_to_srgb(v)*255) for v in r)
def lum_lin(rgb): r,g,b=rgb; return 0.2126*r+0.7152*g+0.0722*b
def lum_hex(h):
    h=h.lstrip('#'); v=[int(h[i:i+2],16)/255 for i in (0,2,4)]
    lin=[x/12.92 if x<=0.04045 else ((x+0.055)/1.055)**2.4 for x in v]
    return lum_lin(lin)
def lum(c):
    if isinstance(c,str): return lum_hex(c)
    L,C,H=c; return lum_lin([min(1,max(0,x)) for x in oklch_to_lin(L,fit(L,C,H),H)])
def ratio(a,b):
    la,lb=lum(a),lum(b)
    if la<lb: la,lb=lb,la
    return (la+0.05)/(lb+0.05)
def mix(a,b,t):
    """linear-ish mix of two colours in sRGB-lin (approx of oklab mix), return hex"""
    def lin(c):
        if isinstance(c,str):
            h=c.lstrip('#'); v=[int(h[i:i+2],16)/255 for i in (0,2,4)]
            return [x/12.92 if x<=0.04045 else ((x+0.055)/1.055)**2.4 for x in v]
        L,C,H=c; return [min(1,max(0,x)) for x in oklch_to_lin(L,fit(L,C,H),H)]
    A,B=lin(a),lin(b)
    m=[x*(1-t)+y*t for x,y in zip(A,B)]
    return '#%02x%02x%02x'%tuple(round(lin_to_srgb(v)*255) for v in m)
