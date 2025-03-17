import ListUnit from '../ListUnit';
import name from '@/assets/svg/name.svg'
// import contact from '@/assets/svg/his.svg'
import setting from '@/assets/svg/setting.svg'

function Settings({ info }: any) {
  const isRealName = info?.verifiedStatus === 'VERIFIED'

  const list = [
    { icon: setting, title: '帐号设置', target: '/subpackages/account/index' },
  ]
  if (!isRealName) {
    list.push({ icon: name, title: '实名认证', target: '/subpackages/auth/index' },)
  }
  return (
    <ListUnit list={list} />
  );
}

export default Settings;
