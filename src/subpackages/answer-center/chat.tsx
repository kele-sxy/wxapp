/**
 * 客服聊天，后台客服端
 */
import ChatUI, {
  Bubble,
  Card,
  Icon,
  MessageProps,
  useMessages,
} from '@chatui/core';
import { View } from '@tarojs/components';
import { memo, useCallback, useEffect, useState } from 'react';
import type { IMessageStatus } from '@chatui/core/lib/components/MessageStatus';
import Taro from '@tarojs/taro';
import { AtList, AtListItem } from 'taro-ui';
import { getChatInfo, MessageItem, useChatContext } from './chat-store';

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

const BubbleMessageWrapper = memo(function BubbleMessageWrapper({
  msgParams,
}: {
  msgParams: MessageProps;
}) {
  const { content, position, status: msgStatus } = msgParams;
  const [status, setStatus] = useState<IMessageStatus | undefined>(msgStatus);
  const sendMessage = useCallback(() => {
    setStatus('pending');
    return new Promise((resolve) => {
      setTimeout(() => {
        msgParams.status = void 0;
        resolve(msgParams);
      }, 3000);
    });
  }, []);
  useEffect(() => {
    if (msgStatus === 'pending') {
      // 发送消息
      sendMessage()
        .then(() => {
          setStatus('sent');
        })
        .catch(() => {
          setStatus('fail');
        });
    }
  }, [msgStatus]);

  return (
    <Bubble content={content.text}>
      {position === 'right' && <MessageItemStatus status={status} />}
    </Bubble>
  );
});

function RenderMessageContent(props: MessageProps) {
  const { type, content } = props;
  // 根据消息类型来渲染
  switch (type) {
    case 'text':
      return <BubbleMessageWrapper msgParams={props} />;
    case 'list':
      return (
        <Bubble
          type='text'
          content={
            <Card className='p-2'>
              <View className='pb-2'>{content?.title}</View>
              <AtList>
                {content?.list?.map((item) => (
                  <AtListItem
                    key={item.id}
                    title={item.text}
                    arrow='right'
                    onClick={() => {
                      Taro.navigateTo({
                        url: `/subpackages/answer-detail/index?questionId=${item.id}`,
                      });
                    }}
                  />
                ))}
              </AtList>
            </Card>
          }
        />
      );
    default:
      return null;
  }
}

interface ChatBoxProps {
  initialMessages: MessageItem[];
}
export default function Chat({ initialMessages }: ChatBoxProps) {
  const { updateMessage } = useChatContext();
  const { messages, appendMsg } = useMessages(initialMessages);
  const userInfo = Taro.getStorageSync('userInfo');

  const handleSend = useCallback(
    (type: string, content: { text?: string; picUrl?: string }) => {
      if (type === 'text') {
        if (content.text?.trim() === '') {
          return;
        }
      }
      appendMsg({
        type,
        content,
        position: 'right',
        status: 'sent',
        user: {
          avatar: userInfo.avatar,
        },
      });
      getChatInfo(content.text?.trim()).then((res) => {
        if (Array.isArray(res)) {
          res.forEach((item) => {
            appendMsg(item);
          });
        } else {
          appendMsg(res);
        }
      });
    },
    [appendMsg],
  );

  useEffect(() => {
    const msgList: MessageItem[] = messages?.map((item: any) => {
      if (!item?.id) {
        return { ...item, id: item._id };
      }
      return item;
    });
    updateMessage(msgList);
  }, [messages]);

  return (
    <div className='w-full h-full'>
      <ChatUI
        messages={messages}
        renderMessageContent={RenderMessageContent}
        onSend={(type, content) => {
          handleSend(type, { text: content });
        }}
        onQuickReplyClick={(item) => {
          if (item.code === 'manual') {
            Taro.navigateTo({ url: '/subpackages/staff-service/index' });
          } else if (item.code === 'complaint') {
            Taro.navigateTo({ url: '/subpackages/complaint-record/index' });
          }
        }}
        placeholder='在这儿输入您的问题试试～'
        loadMoreText='加载更多'
        quickReplies={[
          {
            name: '联系人工客服',
            code: 'manual',
          },
          {
            name: '投诉',
            code: 'complaint',
          },
        ]}
        inputOptions={{
          minRows: 1,
          autoSize: true,
        }}
      />
    </div>
  );
}
