import json, numpy as np
from pen import *
import sig
def f1(v): 
    s=f'{v:.1f}'
    return s[:-2] if s.endswith('.0') else s
def qpath(pts, closed=True):
    d='M'+f1(pts[0][0])+' '+f1(pts[0][1])
    n=len(pts)
    for i in range(1,n-1):
        mx=(pts[i][0]+pts[i+1][0])/2; my=(pts[i][1]+pts[i+1][1])/2
        d+=f'Q{f1(pts[i][0])} {f1(pts[i][1])} {f1(mx)} {f1(my)}'
    d+='L'+f1(pts[-1][0])+' '+f1(pts[-1][1])+('Z' if closed else '')
    return d
def rdp(pts,eps):
    pts=np.asarray(pts); keep=np.zeros(len(pts),bool); keep[0]=keep[-1]=True
    st=[(0,len(pts)-1)]
    while st:
        a,b=st.pop()
        if b<=a+1: continue
        p=pts[a+1:b]; A=pts[a]; B=pts[b]; d=B-A; n=np.hypot(*d)+1e-9
        dist=np.abs(d[0]*(p[:,1]-A[1])-d[1]*(p[:,0]-A[0]))/n
        i=int(np.argmax(dist))
        if dist[i]>eps: keep[a+1+i]=True; st+= [(a,a+1+i),(a+1+i,b)]
    return pts[keep]
def curvature(c):
    t=np.gradient(c,axis=0); a=np.gradient(t,axis=0)
    cr=np.abs(t[:,0]*a[:,1]-t[:,1]*a[:,0]); sp=np.hypot(t[:,0],t[:,1])**3+1e-9
    k=cr/sp
    return np.convolve(np.r_[[k[0]]*4,k,[k[-1]]*4],np.ones(9)/9,'valid')
def speed_profile(c, nk=12):
    cc,L=resample(c,1.0)
    k=curvature(cc)
    v=1/(1+14*k)
    n=len(v); u=np.linspace(0,1,n)
    ease=np.minimum(1,0.45+u/0.10)*np.minimum(1,0.45+(1-u)/0.12)   # slow in, slow out
    v=v*np.clip(ease,0,1)
    dt=1/v; T=np.r_[0,np.cumsum(dt[1:])]
    s=np.linspace(0,1,n)
    Tn=T/T[-1]
    ts=np.linspace(0,1,nk+1)
    ls=np.interp(ts,Tn,s)
    return L, T[-1], [[round(float(t),3),round(float(l),4)] for t,l in zip(ts,ls)]
EPS=0.3
def main():
    strokes=[]; allpts=[]
    for name,pts in sig.STROKES.items():
        c=catmull([sig.sh(p) for p in pts],2.0)
        cc,w,l,r=outline(c,2.0,7.0)
        poly=np.vstack([l,r[::-1]])
        poly=rdp(poly,EPS)
        mid=rdp(cc,0.5)
        L,Tcost,k=speed_profile(c)
        strokes.append(dict(name=name,f=qpath(poly),m=qpath(mid,closed=False),L=L,T=Tcost,k=k))
        allpts.append(poly)
    fl=catmull([sig.sh(p) for p in sig.FLOURISH],2.0)
    cc,w,l,r=outline(fl,1.3,3.8,taper=(50,70))
    poly=np.vstack([l,r[::-1]]); poly=rdp(poly,EPS)
    flour=dict(f=qpath(poly),m=qpath(rdp(fl,0.6),closed=False))
    allpts.append(poly)
    P=np.vstack(allpts)
    x0,y0=P.min(axis=0)-4; x1,y1=P.max(axis=0)+4
    # normalise: translate so that vb starts at 0,0
    return strokes,flour,(x0,y0,x1-x0,y1-y0)
if __name__=='__main__':
    strokes,flour,vb=main()
    Ttot=sum(s['T'] for s in strokes)
    out={'vb':[round(v,1) for v in vb],'strokes':[],'flourish':flour}
    for s in strokes:
        print(s['name'],'len',round(s['L']),'cost',round(s['T']),'f',len(s['f']),'m',len(s['m']))
    print('vb',vb,'flourish',len(flour['f']))
    # write timeline (fractions of the write duration): strokes in sequence, a pen lift
    # between them, the accent flourish overlapping the end of the last stroke.
    gaps=[0.05,0.035]; pen_total=sum(s['T'] for s in strokes)
    avail=0.84-sum(gaps)
    t=0.0
    for i,s_ in enumerate(strokes):
        d=avail*s_['T']/pen_total
        s_['t']=[round(t,3),round(d,3)]
        t+=d+(gaps[i] if i<len(gaps) else 0)
    flour['t']=[round(t-0.02,3),round(1-(t-0.02),3)]
    def r(v): return [round(float(x),2) for x in v]
    data={'vb':r(vb),'strokes':[{'f':s_['f'],'m':s_['m'],'k':s_['k'],'t':s_['t']} for s_ in strokes],'flourish':{'f':flour['f'],'m':flour['m'],'t':flour['t']}}
    json.dump(data,open('sigdata.json','w'),separators=(',',':'))
    print('timeline',[s_['t'] for s_ in strokes],flour['t'])
