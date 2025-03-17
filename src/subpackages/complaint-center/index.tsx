import { COMPLAINT_TYPE } from '@/constant';
import { View, Text } from '@tarojs/components';
import {
  Button,
  Form,
  ImageUploader,
  ImageUploadItem,
  Input,
  Picker,
  TextArea,
  Toast,
} from 'antd-mobile/2x';
import { useEffect, useState } from 'react';
import './index.less';
import CustomNavBar from '@/components/CustomNavBar';
import { addComplaint, uploadImage } from '@/services/service';
import Taro from '@tarojs/taro';

// 限制图片数量
const ImageUpload: React.FC<any> = (props) => {
  const { onChange } = props;
  const maxCount = 3;
  const [fileList, setFileList] = useState<ImageUploadItem[]>([]);

  const beforeUpload = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      Toast.show('请选择小于 10M 的图片');
      return null;
    }

    if (!['image/jpg', 'image/jpeg', 'image/png'].includes(file.type)) {
      Taro.showToast({ title: '不支持的图片类型', icon: 'none' });
      return null;
    }
    return file;
  };

  useEffect(() => {
    const list = fileList?.map((item) => item.url) ?? [];
    onChange(list);
  }, [fileList]);

  return (
    <ImageUploader
      accept='image/jpg,image/jpeg,image/png'
      value={fileList}
      onChange={setFileList}
      upload={async (file) => {
        return uploadImage(file).then((url) => ({ url }));
      }}
      // multiple
      maxCount={3}
      showUpload={fileList.length < maxCount}
      onCountExceed={(exceed) => {
        Toast.show(`最多选择 ${maxCount} 张图片，你多选了 ${exceed} 张`);
      }}
      beforeUpload={beforeUpload}
    />
  );
};

interface ComplaintProps {}

const Complaint: React.FC<ComplaintProps> = () => {
  const [visible, setVisible] = useState(false);
  const [questionType, setQuestionType] = useState<any>('');
  const [submitting, setSubmitting] = useState(false);

  const [form] = Form.useForm();

  const onSubmit = () => {
    form.validateFields().then((values) => {
      setSubmitting(true);
      addComplaint(values)
        .then(() => {
          Taro.showToast({
            title: '投诉成功',
            icon: 'success',
          });
          Taro.navigateBack({ delta: 1 });
        })
        .finally(() => setSubmitting(false));
    });
  };

  return (
    <View className='bg-base-bg p-4 h-screen'>
      <CustomNavBar color='#0E1836' title='投诉中心' gradient={false} />
      <View className='bg-white rounded-xl pt-3'>
        <Form
          form={form}
          name='form'
          footer={
            <Button
              loading={submitting}
              block
              shape='rounded'
              type='submit'
              color='primary'
              size='middle'
              onClick={() => onSubmit()}>
              提交
            </Button>
          }>
          <Form.Item
            name='complaintType'
            label='问题类型'
            rules={[{ required: true, message: '请选择问题类型' }]}>
            <View
              className='flex items-center border-2 border-[#C6C6C6] rounded-[8px] px-3 py-1'
              onClick={() => setVisible(true)}>
              <Input
                placeholder='请选择'
                readOnly
                value={COMPLAINT_TYPE[questionType]}
              />
              <a className='text-xs min-w-8 text-[#4F7FFF]'>选择</a>
            </View>
          </Form.Item>
          <Form.Item
            name='complaintProblem'
            label='问题描述'
            validateTrigger={['onChange', 'onBlur']}
            rules={[{ required: true }]}>
            <View className='border-2 border-[#C6C6C6] rounded-[8px] px-3 py-1 text-xs'>
              <TextArea
                placeholder='请输入'
                rows={5}
                maxLength={50}
                showCount={(length, maxLength) => (
                  <Text className='text-xs'>
                    {length}/{maxLength}
                  </Text>
                )}
              />
            </View>
          </Form.Item>
          <Form.Item name='problemPicture' label='问题截图材料'>
            <ImageUpload />
          </Form.Item>
          <View className='text-sm pl-4 text-gray-400'>
            每张图片大小不超过 10M
          </View>
        </Form>
        <Picker
          columns={[
            Object.keys(COMPLAINT_TYPE).map((key) => ({
              label: COMPLAINT_TYPE[key],
              value: key,
            })),
          ]}
          visible={visible}
          onClose={() => {
            setVisible(false);
          }}
          value={[questionType]}
          onConfirm={([v]) => {
            setQuestionType(v);
            form.setFieldsValue({ complaintType: v });
          }}
        />
      </View>
    </View>
  );
};

export default Complaint;
