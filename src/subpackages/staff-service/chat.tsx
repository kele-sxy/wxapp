/**
 * 客服聊天，后台客服端
 */
import ChatUI, { Bubble, Icon, Image } from '@chatui/core';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { IMessageStatus } from '@chatui/core/lib/components/MessageStatus';
import Taro from '@tarojs/taro';
import {
  CreateChatSSE,
  evaluateComplaint,
  ICreateChatSSE,
  uploadImage,
} from '@/services/service';
import kefuAvatar from '@/assets/svg/kefu.svg';
import { ChatStore, MESSAGE_TYPE, MessageItem } from './chat-store';
import ComplaintDetail from '../components/ComplaintDetail';
import { MessageContainerHandle } from '@chatui/core/lib/components/MessageContainer';
import { View } from '@tarojs/components';
import { Rate, Toast } from 'antd-mobile/2x';
import { AtButton } from 'taro-ui';

const MessageItemStatus = ({
  status,
}: {
  status: IMessageStatus | undefined;
}) => {
  if (status === 'pending') {
    return <Icon style={{ color: 'var(--gray-5)' }} spin type={'spinner'} />;
  }
  if (status === 'fail') {
    return (
      <Icon
        style={{ color: '#ff5959' }}
        type='warning-circle-fill'
        onClick={() => {
          console.log('retry');
        }}
      />
    );
  }
  return null;
};

const MessageItemRender = (props: MessageItem) => {
  const { type, content = {}, status, chatId, messageId } = props;

  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [evaluated, setEvaluated] = useState(false);

  return (
    <Bubble className='Bubble text text-sm'>
      {type === MESSAGE_TYPE.TEXT && <p>{content?.text}</p>}
      {type === MESSAGE_TYPE.IMG && (
        <Image
          lazy
          fluid
          width={100}
          height={100}
          src={content.picUrl!}
          alt='图片加载中...'
          onClick={() => {
            Taro.previewImage({
              current: content.picUrl,
              urls: [content.picUrl!],
            });
          }}
        />
      )}
      {type === MESSAGE_TYPE.FEEDBACK && (
        <>
          <View className='!text-[#0E1836] font-medium'>服务评价邀请</View>
          <View className='mt-2'>
            亲，为了不断提升服务质量，我们诚邀您对本次客服体验进行评价。
          </View>
          <View className='text-xs text-[#6D6D6D] mt-2'>
            点击下方进行评价，用0-5星（5星最佳）
          </View>
          <Rate
            readOnly={evaluated}
            allowHalf
            value={score}
            onChange={(value) => setScore(value)}
          />
          <View className='mt-2'>
            评价将直接帮助我们改进服务，为您带来更好的体验。
          </View>
          <View className='mt-2'>【信誉护航】客服团队</View>
          <AtButton
            type='primary'
            circle
            className='!mt-3 !h-8 flex-center'
            loading={loading}
            disabled={evaluated}
            onClick={() => {
              if (loading) return;
              setLoading(true);
              evaluateComplaint({ chatId, messageId, evaluate: score })
                .then(() => {
                  // 断开链接
                  setEvaluated(true);
                })
                .finally(() => setLoading(false));
            }}>
            {evaluated ? '已评价' : '提交'}
          </AtButton>
        </>
      )}
      {/* bottom 放状态 */}
      {typeof status !== 'undefined' && <MessageItemStatus status={status} />}
    </Bubble>
  );
};

interface ChatBoxProps {
  complaintId?: string; // 投诉的 id
  chatId: string; //会话 id
}
export default function Chat({ complaintId, chatId }: ChatBoxProps) {
  const [, updateComponent] = useState<string>('');
  const userInfo = Taro.getStorageSync('userInfo');
  const [open, setOpen] = useState(false);

  const msgRef = useRef<MessageContainerHandle>(null);

  const chatUserInfo = useMemo(() => {
    return {
      agentInfo: {
        name: '',
        avatar: userInfo.avatar,
      },
      customerInfo: {
        name: '客服',
        avatar: kefuAvatar,
      },
    };
  }, []);

  const store = useMemo(
    () =>
      new ChatStore(
        {
          chatId,
          ...chatUserInfo,
        },
        updateComponent,
      ),
    [],
  );

  const chatScrollToEnd = useCallback(() => {
    msgRef.current?.scrollToEnd({ force: true });
  }, []);

  const sendMessage = (...args: Parameters<typeof store.sendMessage>) => {
    // 每次发完消息，滚动到最下面，接消息不管，因为可能在上面看
    store.sendMessage(...args).finally(chatScrollToEnd);
  };

  const sendImage = useCallback((file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      Toast.show('请选择小于 10M 的图片');
      return Promise.resolve(null);
    }
    if (!['image/jpg', 'image/jpeg', 'image/png'].includes(file.type)) {
      Taro.showToast({ title: '不支持的图片类型', icon: 'none' });
      return Promise.resolve(null);
    }
    return uploadImage(file).then((imgSrc) => {
      if (imgSrc)
        sendMessage({
          type: MESSAGE_TYPE.IMG,
          content: {
            picUrl: imgSrc,
          },
        });
    });
  }, []);

  useEffect(() => {
    // 先init 获取历史数据之后 initialLoading变成false, 因为默认是true
    store.init();
    return () => store.destory();
  }, []);

  useEffect(() => {
    let sse: ICreateChatSSE;
    if (!store.otherState.initialLoading) {
      // 聊天初始信息加载完成之后调用
      setTimeout(chatScrollToEnd, 500);
      sse = new (CreateChatSSE as any)(chatId) as ICreateChatSSE;
      sse.connect();
      sse.onMessage = function (msg: any) {
        store.receiveMessage(msg);
      };
    }
    return () => {
      sse?.close();
    };
  }, [store.otherState.initialLoading]);

  return (
    <div className='w-full h-full'>
      <ChatUI
        messages={store.messageList}
        renderMessageContent={MessageItemRender}
        messagesRef={msgRef}
        onSend={(type, val) => {
          if (type === 'text' && val.trim()) {
            sendMessage({
              type: MESSAGE_TYPE.TEXT,
              content: {
                text: val,
              },
            });
          }
        }}
        onRefresh={() => {
          if (store.otherState.hasMore) return store.loadMore();
          return Promise.resolve([]);
        }}
        onImageSend={sendImage}
        onQuickReplyClick={(item) => {
          if (item.code === 'complaint') {
            setOpen(true);
          }
        }}
        // onScroll={(event) => {
        //   console.log('🚀 ~ Chat ~ event:', event);
        // }}
        placeholder='在这儿输入您的问题试试～'
        loadMoreText={
          store.otherState.hasMore ? '加载更多...' : '没有更多消息了~'
        }
        toolbar={[
          {
            type: 'image',
            icon: 'image',
            title: '相册',
          },
        ]}
        quickReplies={
          complaintId
            ? [
                {
                  name: '投诉详情',
                  code: 'complaint',
                },
              ]
            : undefined
        }
        onToolbarClick={(item) => {
          if (item.type === 'image') {
            Taro.chooseImage({
              count: 1,
              sourceType: ['album'],
              success(result) {
                console.log('🚀 ~ success ~ result:', result);
                if (result?.tempFiles?.length) {
                  const { originalFileObj: file } = result?.tempFiles[0];
                  // 发起请求，具体自行实现
                  sendImage(file!);
                }
              },
            });
          }
        }}
      />
      <ComplaintDetail
        complaintId={complaintId}
        open={open}
        setOpen={setOpen}
      />
    </div>
  );
}
