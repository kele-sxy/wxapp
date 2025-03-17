import { View } from '@tarojs/components';
import classNames from 'classnames';

import { AtIcon } from 'taro-ui';

import './index.less';

interface CustomCheckboxProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  checked,
  onChange = () => {},
  className = '',
}) => {
  const toggleCheckbox = () => {
    onChange(!checked);
  };

  return (
    <View
      className={`custom-checkbox flex-shrink-0 pb-5 pt-2.5 -mt-2 ${className}`}
      onClick={toggleCheckbox}>
      <View
        className={classNames('checkbox-box', {
          '!bg-blue-500 !border-blue-500': checked,
        })}>
        {checked && (
          <AtIcon
            color='#fff'
            size={'13rpx'}
            value='check'
            className='top-2.5 absolute'
          />
        )}
      </View>
    </View>
  );
};

export default CustomCheckbox;
