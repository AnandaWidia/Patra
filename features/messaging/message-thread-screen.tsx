'use client';

import { useEffect, useState } from 'react';

import { AppShell } from '@/components/shell/app-shell';
import { ActionControl } from '@/components/ui/action-control';
import { Gap } from '@/components/ui/gap';
import { Message } from '@/components/ui/message';
import { TextInput } from '@/components/ui/text-input';
import { Label, Meta } from '@/components/ui/typography';
import { useMessages } from '@/lib/hooks/use-patra-data';
import { sendMessage } from '@/lib/services/traveller';
import type { MessageView } from '@/types/view-models';

/**
 * Message Thread — Figma 2:3304.
 *
 * §03 — back only; the thread has no forward exit.
 * §07 — sending a message does not navigate.
 *
 * The composer is rendered through the shell's footer slot rather than inside
 * the scroll region. §14: it scrolls with the transcript in Figma, but
 * "engineering should pin it — this is the correct behaviour and the Figma
 * limitation should not be reproduced." Owning both here keeps the transcript
 * and the composer on one piece of state.
 */
export function MessageThreadScreen({
  conversationId = 'cv-01',
}: {
  conversationId?: string;
}) {
  const { data: loaded } = useMessages(conversationId);
  const [messages, setMessages] = useState<MessageView[]>(loaded);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    setMessages(loaded);
  }, [loaded]);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const body = draft.trim();
    if (!body) return;

    // §14 — no sent-state was designed; engineering should add one, and it
    // conflicts with nothing frozen. The entry is appended optimistically and
    // reconciled once the write returns.
    const optimistic: MessageView = {
      id: `pending-${Date.now()}`,
      attribution: 'YOU · SENDING',
      body,
      author: 'traveller',
    };
    setMessages((current) => [...current, optimistic]);
    setDraft('');

    void sendMessage(conversationId, body)
      .then((saved) => {
        if (!saved) return;
        setMessages((current) =>
          current.map((m) => (m.id === optimistic.id ? saved : m))
        );
      })
      .catch(() => {
        // §08 — "Send failed, retry." The entry stays so nothing is lost.
        setMessages((current) =>
          current.map((m) =>
            m.id === optimistic.id ? { ...m, attribution: 'YOU · NOT SENT' } : m
          )
        );
      });
  };

  return (
    <AppShell
      variant="pushed"
      title="Message Thread"
      footer={
        <form onSubmit={onSubmit} className="flex w-full flex-col gap-4">
          <TextInput
            label="WRITE TO I MADE"
            placeholder="He reads this on WhatsApp."
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
          <ActionControl type="submit">Send</ActionControl>
        </form>
      }
    >
      <Label>WITH I MADE SUARTA</Label>
      <Gap size={12} />
      <Meta>Carving · Thursday 18 June</Meta>
      <Gap size={24} />

      {messages.map((message, index) => (
        <div key={message.id} className="w-full">
          {index > 0 ? <Gap size={16} /> : null}
          <Message
            attribution={message.attribution}
            body={message.body}
            from={message.author === 'host' ? 'host' : 'you'}
          />
        </div>
      ))}
    </AppShell>
  );
}
