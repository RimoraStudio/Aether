/*
 * Aether -- mouse and keyboard sharing utility
 * SPDX-FileCopyrightText: (C) 2012 - 2021 Synergy App Ltd
 * SPDX-FileCopyrightText: (C) 2002 Chris Schoeneman
 * SPDX-License-Identifier: GPL-2.0-only WITH LicenseRef-OpenSSL-Exception
 */

#if WINAPI_XWINDOWS
#include "base/Log.h"
#include <memory>

#include "AetherXkbKeyboard.h" // Include last due to X11 use

namespace aether::linux {

AetherXkbKeyboard::AetherXkbKeyboard()
{
  using XkbDisplay = std::unique_ptr<Display, decltype(&XCloseDisplay)>;
  XkbDisplay display(XkbOpenDisplay(nullptr, nullptr, nullptr, nullptr, nullptr, nullptr), &XCloseDisplay);

  if (display) {
    if (!XkbRF_GetNamesProp(display.get(), nullptr, &m_data)) {
      LOG_WARN("error reading keyboard layouts");
    }
  } else {
    LOG_WARN("can't open xkb display during reading languages");
  }
}

const char *AetherXkbKeyboard::getLayout() const
{
  return m_data.layout ? m_data.layout : "us";
}

const char *AetherXkbKeyboard::getVariant() const
{
  return m_data.variant ? m_data.variant : "";
}

AetherXkbKeyboard::~AetherXkbKeyboard()
{
  std::free(m_data.model);
  std::free(m_data.layout);
  std::free(m_data.variant);
  std::free(m_data.options);
}

} // namespace aether::linux

#endif // WINAPI_XWINDOWS
