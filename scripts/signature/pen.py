import math, json, sys
import numpy as np

def catmull(pts, step=2.0, alpha=0.5):
    """centripetal Catmull-Rom through pts, sampled ~every `step` units. Cusp = repeat point twice."""
    P=[np.array(p,float) for p in pts]
    # duplicate endpoints
    P=[P[0]+(P[0]-P[1])*0.0]+P+[P[-1]]
    out=[]
    for i in range(1,len(P)-2):
        p0,p1,p2,p3=P[i-1],P[i],P[i+1],P[i+2]
        d1=max(np.linalg.norm(p1-p0),1e-6)**alpha
        d2=max(np.linalg.norm(p2-p1),1e-6)**alpha
        d3=max(np.linalg.norm(p3-p2),1e-6)**alpha
        if np.linalg.norm(p2-p1)<1e-6: continue
        # tangents (Barry-Goldman)
        t0,t1,t2,t3=0,d1,d1+d2,d1+d2+d3
        n=max(4,int(np.linalg.norm(p2-p1)/step))
        for k in range(n):
            t=t1+(t2-t1)*k/n
            A1=(t1-t)/(t1-t0)*p0+(t-t0)/(t1-t0)*p1
            A2=(t2-t)/(t2-t1)*p1+(t-t1)/(t2-t1)*p2
            A3=(t3-t)/(t3-t2)*p2+(t-t2)/(t3-t2)*p3
            B1=(t2-t)/(t2-t0)*A1+(t-t0)/(t2-t0)*A2
            B2=(t3-t)/(t3-t1)*A2+(t-t1)/(t3-t1)*A3
            out.append((t2-t)/(t2-t1)*B1+(t-t1)/(t2-t1)*B2)
    out.append(P[-2])
    return np.array(out)

def resample(poly, step):
    d=np.r_[0,np.cumsum(np.hypot(*np.diff(poly,axis=0).T))]
    L=d[-1]; n=max(2,int(L/step)+1)
    s=np.linspace(0,L,n)
    return np.c_[np.interp(s,d,poly[:,0]),np.interp(s,d,poly[:,1])], L

def smooth(a,k):
    if k<=0: return a
    pad=np.r_[np.repeat(a[:1],k,axis=0),a,np.repeat(a[-1:],k,axis=0)]
    ker=np.hanning(2*k+3)[1:-1]; ker/=ker.sum()
    return np.c_[np.convolve(pad[:,0],ker,'valid'),np.convolve(pad[:,1],ker,'valid')]

def outline(center, wmin, wmax, down=(0.26,1.0), taper=(10,16)):
    """pointed-pen model: width grows when moving along `down` (slanted downstroke)."""
    c,_=resample(center,1.5)
    c=smooth(c,2)
    t=np.gradient(c,axis=0); nrm=np.hypot(t[:,0],t[:,1])+1e-9; t=t/nrm[:,None]
    dn=np.array(down)/np.hypot(*down)
    s=np.clip(t@dn,0,1)**1.0
    s=np.clip((s-0.15)/0.75,0,1)
    s=s*s*(3-2*s)
    w=wmin+(wmax-wmin)*s
    # smooth width
    w=np.convolve(np.r_[[w[0]]*8,w,[w[-1]]*8],np.hanning(17)/np.hanning(17).sum(),'valid')
    # taper ends
    d=np.r_[0,np.cumsum(np.hypot(*np.diff(c,axis=0).T))]; L=d[-1]
    a=np.clip(d/taper[0],0,1); b=np.clip((L-d)/taper[1],0,1)
    w=w*(0.35+0.65*np.sqrt(a*b)) if False else w*(0.30+0.70*np.sqrt(np.minimum(a,1)))*(0.30+0.70*np.sqrt(np.minimum(b,1)))
    nv=np.c_[-t[:,1],t[:,0]]
    left=c+nv*(w/2)[:,None]; right=c-nv*(w/2)[:,None]
    return c,w,left,right
