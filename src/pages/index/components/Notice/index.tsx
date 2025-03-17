import ListUnit from '../ListUnit';
import agreement from '@/assets/svg/agreement.svg';
import notice from '@/assets/svg/notice.svg';

function Notice() {
  const list = [
    { icon: notice, title: '公告', target: '/subpackages/announcement/index' },
    {
      icon: agreement,
      title: '用户协议',
      target: '/subpackages/my-agreement/index',
    },
  ];
  return <ListUnit list={list} />;
}

export default Notice;
