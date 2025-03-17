import { atom } from 'jotai';

export interface Userinfo {
  head: string;
  id: number;
  mobile: null | string;
  name: string;
  openid: string;
  session_key: string;
  token: string;
}

export const userinfoState = atom<null | Userinfo>(null);
