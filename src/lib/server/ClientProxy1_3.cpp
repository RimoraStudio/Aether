/*
 * Aether -- mouse and keyboard sharing utility
 * SPDX-FileCopyrightText: (C) 2025 Rimora Studio
 * SPDX-FileCopyrightText: (C) 2012 - 2016 Synergy App Ltd
 * SPDX-FileCopyrightText: (C) 2006 Chris Schoeneman
 * SPDX-License-Identifier: GPL-2.0-only WITH LicenseRef-OpenSSL-Exception
 */

#include "server/ClientProxy1_3.h"

#include "aether/ProtocolUtil.h"
#include "aether/ipc/CoreIpc.h"
#include "base/IEventQueue.h"
#include "base/Log.h"

#include <cstring>

//
// ClientProxy1_3
//

ClientProxy1_3::ClientProxy1_3(const std::string &name, aether::IStream *stream, IEventQueue *events)
    : ClientProxy1_2(name, stream, events),
      m_events(events)
{
  setHeartbeatRate(kKeepAliveRate, kKeepAliveRate * kKeepAlivesUntilDeath);
}

ClientProxy1_3::~ClientProxy1_3()
{
  // cannot do this in superclass or our override wouldn't get called
  removeHeartbeatTimer();
}

void ClientProxy1_3::mouseWheel(int32_t xDelta, int32_t yDelta)
{
  LOG_VERBOSE("send mouse wheel to \"%s\" %+d,%+d", getName().c_str(), xDelta, yDelta);
  ProtocolUtil::writef(getStream(), kMsgDMouseWheel, xDelta, yDelta);
}

bool ClientProxy1_3::parseMessage(const uint8_t *code)
{
  // process message
  if (memcmp(code, kMsgCKeepAlive, 4) == 0) {
    if (!m_pendingKeepAlives.empty()) {
      const auto sentAt = m_pendingKeepAlives.front();
      m_pendingKeepAlives.pop_front();
      const auto latencyMs =
          std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::steady_clock::now() - sentAt).count();
      const auto payload = QString::fromStdString(getName()) + QLatin1Char('|') + QString::number(latencyMs);
      ipcSendToClient(QStringLiteral("peerLatency"), payload);
    }

    resetHeartbeatTimer();
    return true;
  } else {
    return ClientProxy1_2::parseMessage(code);
  }
}

void ClientProxy1_3::resetHeartbeatRate()
{
  setHeartbeatRate(kKeepAliveRate, kKeepAliveRate * kKeepAlivesUntilDeath);
}

void ClientProxy1_3::setHeartbeatRate(double rate, double)
{
  m_keepAliveRate = rate;
  ClientProxy1_2::setHeartbeatRate(rate, rate * kKeepAlivesUntilDeath);
}

void ClientProxy1_3::resetHeartbeatTimer()
{
  // reset the alarm but not the keep alive timer
  ClientProxy1_2::removeHeartbeatTimer();
  ClientProxy1_2::addHeartbeatTimer();
}

void ClientProxy1_3::addHeartbeatTimer()
{
  // create and install a timer to periodically send keep alives
  if (m_keepAliveRate > 0.0) {
    m_keepAliveTimer = m_events->newTimer(m_keepAliveRate, nullptr);
    m_events->addHandler(EventTypes::Timer, m_keepAliveTimer, [this](const auto &) { keepAlive(); });
  }

  // superclass does the alarm
  ClientProxy1_2::addHeartbeatTimer();
}

void ClientProxy1_3::removeHeartbeatTimer()
{
  // remove the timer that sends keep alives periodically
  if (m_keepAliveTimer != nullptr) {
    m_events->removeHandler(EventTypes::Timer, m_keepAliveTimer);
    m_events->deleteTimer(m_keepAliveTimer);
    m_keepAliveTimer = nullptr;
  }

  // superclass does the alarm
  ClientProxy1_2::removeHeartbeatTimer();
}

void ClientProxy1_3::keepAlive()
{
  m_pendingKeepAlives.push_back(std::chrono::steady_clock::now());
  if (m_pendingKeepAlives.size() > 8) {
    m_pendingKeepAlives.pop_front();
  }
  ProtocolUtil::writef(getStream(), kMsgCKeepAlive);
}
