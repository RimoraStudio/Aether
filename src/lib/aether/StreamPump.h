/*
 * Aether -- mouse and keyboard sharing utility
 * SPDX-FileCopyrightText: (C) 2026 Rimora Studio
 * SPDX-License-Identifier: GPL-2.0-only WITH LicenseRef-OpenSSL-Exception
 */

#pragma once

#include <cstdint>
#include <functional>

class IEventQueue;

namespace aether {
class IStream;
}

//! Bidirectional byte relay between two streams
/*!
Pumps bytes between two streams using the event queue. Data read from
one stream is written to the other, and input shutdown on one side is
propagated as output shutdown on the peer. When the relay ends the
streams are closed and the done callback fires once.
*/
class StreamPump
{
public:
  StreamPump(aether::IStream *a, aether::IStream *b, IEventQueue *events, std::function<void()> onDone);
  StreamPump(const StreamPump &) = delete;
  StreamPump &operator=(const StreamPump &) = delete;
  ~StreamPump();

private:
  void handleData(aether::IStream *from, aether::IStream *to);
  void handleShutdown(aether::IStream *from, aether::IStream *to);
  void handleError();
  void finish();

  static constexpr uint32_t kChunkSize = 64 * 1024;

  IEventQueue *m_events;
  aether::IStream *m_a;
  aether::IStream *m_b;
  std::function<void()> m_onDone;
  bool m_aInputShutdown = false;
  bool m_bInputShutdown = false;
  bool m_done = false;
};
