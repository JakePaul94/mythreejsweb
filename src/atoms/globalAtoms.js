import { atom } from "jotai";



const pageStateAtom = atom({ current: 0, previous: 0 });
const windowHeightAtom = atom(window.innerHeight)
const isLoadedAtom = atom(false)

const typeOSAtom = atom(null)
export {
  pageStateAtom,isLoadedAtom,windowHeightAtom,typeOSAtom
};
