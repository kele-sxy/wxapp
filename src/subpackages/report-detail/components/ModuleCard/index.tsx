import InfoCard, { type InfoCardProps } from '@/components/InfoCard';
import { View, Image } from '@tarojs/components';
import './index.less';

interface ModuleCardProps extends InfoCardProps {
  divide?: boolean;
  imageUrl?: string;
}

export default function ModuleCard(props: ModuleCardProps) {
  const { title, divide = false, children, imageUrl = '', ...extra } = props;
  return (
    <View className='module-card'>
      <Image className='status-icon' src={imageUrl} />
      <InfoCard title={title} noShadow {...extra}>
        {divide && <View className='divide' />}
        <View className='text-sm text-[#51545B]'>{children}</View>
      </InfoCard>
    </View>
  );
}
