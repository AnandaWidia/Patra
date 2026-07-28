'use client';

import { ConversationRow } from '@/components/ui/conversation-row';
import { Gap } from '@/components/ui/gap';
import { Label, Meta, Title } from '@/components/ui/typography';
import { ROUTES } from '@/constants/routes';
import { useConversations } from '@/lib/hooks/use-patra-data';

/**
 * Messages — Figma 2:3292.
 * §03 — unread carried by border weight, dot and word.
 */
export function MessagesScreen() {
  const { data: conversations } = useConversations();

  return (
    <>
      <Label>MESSAGES</Label>
      <Gap size={12} />
      <Title>Two hosts have written.</Title>
      <Gap size={24} />

      {conversations.map((conversation, index) => (
        <div key={conversation.id} className="w-full">
          {index > 0 ? <Gap size={16} /> : null}
          <ConversationRow
            href={ROUTES.messageThread(conversation.id)}
            hostName={conversation.hostName}
            preview={conversation.lastMessagePreview}
            timestamp={conversation.lastMessageAt}
            unread={conversation.unread}
          />
        </div>
      ))}

      <Gap size={16} />
      <Gap size={24} />
      <Meta>
        Hosts reply from WhatsApp. Your messages reach them there, and theirs
        arrive here — you do not need to be in the app for either.
      </Meta>
    </>
  );
}
