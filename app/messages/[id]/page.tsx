import { MessageThreadScreen } from '@/features/messaging/message-thread-screen';

/** The screen composes its own shell so the composer can be pinned (§14). */
export default function MessageThreadPage() {
  return <MessageThreadScreen />;
}
